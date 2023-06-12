include.module( 'tool-directions.tool-directions-waypoints-js', [
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-panel-js',
    'tool-directions.panel-directions-html',
    'component-address-search',
    'component-command-button',
    'api'
], function ( inc ) {
    "use strict";

    function close( waypoint1, waypoint2 ) {
        if ( Math.abs( waypoint1.latitude - waypoint2.latitude ) > 1e-5 ) return false
        if ( Math.abs( waypoint1.longitude - waypoint2.longitude ) > 1e-5 ) return false
        return true
    }

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'directions-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'directions-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-directions.panel-directions-html' ],
        props: [ 'waypoints', 'hasRoute', 'routeStats', 'optimal', 'geocoderService' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'DirectionsWaypointsTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'directions-widget' )
            SMK.TYPE.ToolPanel.call( this, 'directions-panel' )

            this.defineProp( 'waypoints' )
            this.defineProp( 'hasRoute' )
            this.defineProp( 'routeStats' )
            this.defineProp( 'optimal' )
            this.defineProp( 'geocoderService' )
            this.defineProp( 'routePlannerService' )
            this.defineProp( 'activating' )
            this.defineProp( 'directions' )
            this.defineProp( 'segmentLayers' )
            this.defineProp( 'waypointLayers' )
            this.defineProp( 'markerLayers' )

            this.waypoints = []
            this.hasRoute = false
            this.activating = SMK.UTIL.resolved()
            this.directions = []
        },
        function ( smk ) {
            var self = this

            this.routePanel = smk.getToolById( 'DirectionsRouteTool' )
            this.routeOptions = smk.getToolById( 'DirectionsOptionsTool' )

            this.routePlanner = new SMK.TYPE.RoutePlanner( this.routePlannerService )
            this.geocoder = new SMK.TYPE.Geocoder( this.geocoderService )

            this.map = smk.$viewer.map;

            this.changedActive( function () {
                if ( self.active ) {
                    // if ( self.waypoints.length == 0 ) {
                        // self.activating = self.activating.then( function () {
                            // return self.startAtCurrentLocation()
                        // } )
                    // }
                    // else {
                        // self.activating = self.activating.then( function () {
                            // return self.findRoute()
                        // } )
                    // }

                    self.optimal = self.routeOptions.optimal
                }
            } )

            this.getCurrentLocation = function () {
                self.showStatusMessage( 'Finding current location...', 'progress', null )
                self.busy = true

                return smk.$viewer.getCurrentLocation().finally( function () {
                    self.busy = false
                    self.showStatusMessage()
                } )
            }

            smk.$viewer.handlePick( 2, function ( location ) {
                if ( !self.active ) return

                return self.geocoder.fetchNearestSite( location.map ).then( function ( site ) {
                    self.active = true

                    return self.activating.then( function () {
                        return self.addWaypoint( site )
                    } )
                } )
                .catch( function ( err ) {
                    console.debug( err )
                } )
                .then( function () {
                    return true
                } )
            } )

            smk.on( this.id, {
                'current-location': function ( ev ) {
                    self.addCurrentLocation().then( function () {
                        self.findRoute()
                    } )
                },

                'reverse': function ( ev ) {
                    self.waypoints.reverse()
                    self.findRoute()
                },

                'clear': function ( ev ) {
                    self.resetWaypoints()
                },

                'hover-direction': function ( ev ) {
                    self.directionHighlight = ev.highlight
                },

                'pick-direction': function ( ev ) {
                    self.directionPick = ev.pick
                },

                'changed-waypoints': function ( ev ) {
                    self.findRoute()
                },

                'remove-waypoint': function ( ev ) {
                    self.waypoints.splice( ev.index, 1 )

                    self.hasRoute = self.waypoints.length > 1
                    self.findRoute()
                },

                'new-waypoint': function ( ev ) {
                    if ( ev.latitude ) {
                        self.addWaypoint( ev )
                    }
                },

                'route': function ( ev ) {
                    self.routePanel.active = true
                },

                'options': function ( ev ) {
                    self.routeOptions.active = true
                }
            } )

            this.layer = {}
            var groupItems = []
            this.segmentLayers.concat( this.waypointLayers ).concat(this.markerLayers).forEach( function ( ly ) {
                ly.type = 'vector'
                ly.isVisible = true
                ly.isInternal = true

                var display = smk.$viewer.addLayer( ly )
                display.class = "smk-inline-legend"

                groupItems.push( { id: display.id } )

                self.layer[ ly.id ] = smk.$viewer.layerId[ ly.id ]

                if ( ly.isDraggable )
                    self.layer[ ly.id ].changedFeature( function ( ev ) {
                        self.updateWaypoint( ev.geojson.properties.index, ev.newPt )
                    } )
            } )

            smk.$viewer.setDisplayContextItems( this.type, [ {
                id: this.id,
                type: 'group',
                title: this.title,
                isVisible: false,
                isInternal: true,
                items: groupItems
            } ] )


            this.setInternalLayerVisible = function ( visible ) {
                smk.$viewer.displayContext[ self.type ].setItemVisible( self.id, visible )
            }

            this.handleRouteData = function ( data ) {
                if ( SMK.HANDLER.has( self.id, 'route' ) )
                    SMK.HANDLER.get( self.id, 'route' )( smk, data )
            }
        },
        {
            addWaypoint: function ( site ) {
                var self = this

                if ( !site )
                    return this.showStatusMessage( 'Unable to get location', 'error', 1000 )

                var top = this.waypoints[ this.waypoints.length - 1 ]
                if ( top && close( top, site ) )
                    return this.showStatusMessage( 'Location too close to previous one', 'error', 1000 )

                if ( !site.fullAddress )
                    this.showStatusMessage( 'Unable to find address for location', 'error', 1000 )

                this.waypoints.push( site )

                return this.findRoute()
            },

            addCurrentLocation: function () {
                var self = this

                return self.getCurrentLocation()
                    .then( function ( res ) {
                        return self.addWaypoint( res )
                    } )
                    .catch( function () {
                        return self.showStatusMessage( 'Unable to get current location', 'error', 1000 )
                    } )
            },

            updateWaypoint: function ( index, newPt ) {
                var self = this

                this.active = true

                return this.geocoder.fetchNearestSite( newPt ).then( function ( site ) {
                    self.waypoints[ index ] = site

                    return self.findRoute()
                } )
            },
            // startAtCurrentLocation: function () {
            //     var self = this

            //     return self.resetWaypoints()
            //         .then( function () {
            //             return self.getCurrentLocation()
            //                 .then( function ( res ) {
            //                     return self.addWaypoint( res )
            //                 } )
            //                 .catch( function () {
            //                     return self.showStatusMessage( 'Unable to get current location', 'error', 1000 )
            //                 } )
            //         } )
            // }

            resetWaypoints: function ( ) {
                var self = this

                this.waypoints = []
                this.hasRoute = false

                return this.findRoute()
            },

            findRoute: function () {
                var self = this

                this.directions = []
                this.directionHighlight = null
                this.directionPick = null
                this.showStatusMessage()
                this.clearLayers()

                var points = this.waypoints
                    .map( function ( w, i ) { return { index: i, latitude: w.latitude, longitude: w.longitude } } )

                if ( points.length < 2 ) {
                    self.handleRouteData()
                    self.displayWaypoints()
                    this.showStatusMessage( 'Add a waypoint' )
                    return SMK.UTIL.resolved()
                }

                this.showStatusMessage( 'Constructing route...', 'progress', null )
                this.busy = true
                this.hasRoute = false

                var opt = {
                    criteria:           this.routeOptions.criteria,
                    roundTrip:          this.routeOptions.roundTrip,
                    optimal:            this.routeOptions.optimal,
                    truck:              this.routeOptions.truck,
                    followTruckRoute:   !!this.routeOptions.truck,
                    truckRouteMultiplier:this.routeOptions.truck && this.routeOptions.truckRoute,
                    height:             this.routeOptions.truck && this.routeOptions.truckHeight,
                    weight:             this.routeOptions.truck && this.routeOptions.truckWeight,
                    oversize:           this.routeOptions.oversize,
                    rangeKm:            this.routeOptions.rangeKm
                }

                return this.routePlanner.fetchDirections( points, opt )
                    .then( function ( data ) {
                        self.handleRouteData( data )

                        self.displaySegments( data.segments )

                        if ( data.visitOrder && data.visitOrder.findIndex( function ( v, i ) { return points[ v ].index != i } ) != -1 ) {
                            // console.log( data.visitOrder )
                            // console.log( data.visitOrder.map( function ( v ) { return points[ v ].index } ) )
                            // console.log( JSON.stringify( self.waypoints, null, '  ' ) )

                            self.waypoints = data.visitOrder.map( function ( v ) { return self.waypoints[ points[ v ].index ] } )
                            // console.log( JSON.stringify( self.waypoints, null, '  ' ) )
                            // self.addWaypoint()
                        }

                        self.displayWaypoints()

                        const distanceRounded = Number.isNaN(data.distance) ? data.distance : data.distance.toFixed(1);
                        self.routeStats = `${distanceRounded} ${data.distanceUnit}  (${data.timeText})`;

                        self.showStatusMessage( 'Route travels ' + self.routeStats, 'summary' )

                        self.hasRoute = true

                        self.directions = data.directions

                        self.directionsRaw = data
                        self.directionsRaw.waypoints = JSON.parse( JSON.stringify( self.waypoints ) )

                        if (data.rangeLimit) {
                            self.displayRangeLimit(data.rangeLimit);
                        }
                    } )
                    .catch( function ( err ) {
                        console.debug( err )
                        self.showStatusMessage( 'Unable to find route', 'error' )
                        self.displayWaypoints()
                    } )
                    .finally( function () {
                        self.busy = false
                    } )
            },

            clearLayers: function () {
                var self = this

                this.setInternalLayerVisible( false )

                Object.keys( this.layer ).forEach( function ( id ) {
                    self.layer[ id ].clear()
                } )
            },

            displaySegments: function ( segments ) {
                var self = this

                this.setInternalLayerVisible( true )

                var fc = {}
                segments.features.forEach( function( sg ) {
                    var ly = sg.properties[ '@layer' ] || '@segments'
                    if ( !fc[ ly ] ) fc[ ly ] = []
                    fc[ ly ].push( sg )
                } )

                Object.keys( fc ).forEach( function ( ly ) {
                    if ( !self.layer[ ly ] ) {
                        console.warn( 'no layer defined for ' + ly )
                        return
                    }
                    self.layer[ ly ].load( turf.featureCollection( fc[ ly ] ) )
                    fc[ ly ].forEach( function ( sg ) {
                        sg.style = self.layer[ ly ].config.style
                    } )
                } )

                const bbox = turf.bbox(segments);
                const latLngBounds = L.latLngBounds({lng: bbox[0], lat: bbox[1]}, {lng: bbox[2], lat: bbox[3]});
                self.map.flyToBounds(latLngBounds, {padding: [100,100]});
            },

            displayWaypoints: function () {
                var self = this

                var wl = this.waypoints.length

                if ( wl > 0 )
                    this.layer[ '@waypoint-start' ].load( waypointGeom( this.waypoints[ 0 ], 0 ) )

                if ( wl > 1 )
                    this.layer[ '@waypoint-end' ].load( waypointGeom( this.waypoints[ wl - 1 ], wl - 1 ) )

                if ( wl > 2 ) {
                    self.layer[ '@waypoint-middle' ].load( turf.featureCollection(
                        this.waypoints.slice( 1, wl - 1 ).map( function ( wp, i ) {
                            return waypointGeom( wp, 1 + i )
                        } )
                    ) )
                }

                this.setInternalLayerVisible( wl > 0 )

                function waypointGeom( wp, index ) {
                    return turf.point( [ wp.longitude, wp.latitude ], { index: index } )
                }
            },
            displayRangeLimit: function(rangeLimit) {
                this.layer['@range-limit'].load(turf.point(rangeLimit));
            }
        }
    )
} )

