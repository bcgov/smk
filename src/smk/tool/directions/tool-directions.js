include.module( 'tool-directions', [ 
    'tool', 
    'widgets', 
    'sidepanel', 
    'tool-directions.panel-directions-html', 
    'tool-directions.router-api-js', 
    'tool-directions-route', 
    'tool-directions-options',
    'widget-address-search'
], function ( inc ) {
    "use strict";

    var base = include.option( 'baseUrl' ) + '/images/tool/directions'

    var routerApi = inc[ 'tool-directions.router-api-js' ]
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'directions-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'directions-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions.panel-directions-html' ],
        props: [ 'waypoints', 'hasRoute', 'optimal' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsTool( option ) {
        this.makePropWidget( 'icon', null ) 

        this.makePropPanel( 'waypoints', [] )
        this.makePropPanel( 'hasRoute', false )
        this.makePropPanel( 'optimal', false )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            // order:          4,
            // position:       'menu',
            // title:          'Route Planner',
            widgetComponent:'directions-widget',
            panelComponent: 'directions-panel',
            apiKey:         null,
            segmentLayers: [
                {
                    id: "@segments",
                    title: "Segments",
                    style: {
                        strokeColor: "blue",
                        strokeWidth: 8,
                        strokeOpacity: 0.8
                    },
                    legend: {
                        line: true
                    }
                },
            ],
            waypointLayers: [
                {
                    id: "@waypoint-start",
                    title: "Starting Route Location",
                    style: {
                        markerUrl:      base + '/marker-icon-green.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Starting Route Location",
                        point: true
                    }
                },
                {
                    id: "@waypoint-end",
                    title: "Ending Route Location",
                    style: {
                        markerUrl:      base + '/marker-icon-red.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Ending Route Location",
                        point: true
                    }
                },
                {
                    id: "@waypoint-middle",
                    title: "Waypoint on Route",
                    style: {
                        markerUrl:      base + '/marker-icon-blue.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Waypoint on Route",
                        point: true
                    }
                }
            ]
        }, option ) )

        this.activating = SMK.UTIL.resolved()

        this.directions = []
    }

    SMK.TYPE.DirectionsTool = DirectionsTool

    $.extend( DirectionsTool.prototype, SMK.TYPE.PanelTool.prototype )
    DirectionsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.routePanel = smk.$tool[ 'directions-route' ]
        this.routeOptions = smk.$tool[ 'directions-options' ]

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
            self.setMessage( 'Finding current location...', 'progress', null )
            self.busy = true

            return SMK.UTIL.promiseFinally( smk.$viewer.getCurrentLocation(), function () {
                self.busy = false
                self.setMessage()
            } )
        }

        smk.$viewer.handlePick( 2, function ( location ) {
            if ( !self.active ) return

            return SMK.UTIL.findNearestSite( location.map ).then( function ( site ) {
                self.active = true

                return self.activating.then( function () {
                    return self.addWaypoint( site )
                } )
            } )
            .catch( function ( err ) {
                console.warn( err )
                return self.addWaypoint()
            } )
            .then( function () {
                return true
            } )
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                self.active = !self.active
            },

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

        routerApi.setApiKey( this.apiKey )

        this.layer = {}
        var groupItems = []
        this.segmentLayers.concat( this.waypointLayers ).forEach( function ( ly ) {
            ly.type = 'vector'
            ly.isVisible = true
            ly.isInternal = true

            var display = smk.$viewer.addLayer( ly )
            display.class = "smk-inline-legend"            

            groupItems.push( { id: display.id } )
            // smk.$layerItems.push( display )

            self.layer[ ly.id ] = smk.$viewer.layerId[ ly.id ]
        } )
        smk.$layerItems.push( {
            type: 'group',
            title: this.title,
            isVisible: true,
            isInternal: true,
            items: groupItems
        } )

        this.handleRouteData = function ( data ) {
            if ( SMK.HANDLER.has( self.id, 'route' ) )
                SMK.HANDLER.get( self.id, 'route' )( smk, data )
        }        
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function close( waypoint1, waypoint2 ) {
        if ( Math.abs( waypoint1.latitude - waypoint2.latitude ) > 1e-5 ) return false 
        if ( Math.abs( waypoint1.longitude - waypoint2.longitude ) > 1e-5 ) return false 
        return true
    }

    DirectionsTool.prototype.addWaypoint = function ( site ) {
        var self = this

        if ( !site ) 
            return this.setMessage( 'Unable to get location', 'error', 1000 )

        var top = this.waypoints[ this.waypoints.length - 1 ]
        if ( top && close( top, site ) ) 
            return this.setMessage( 'Location too close to previous one', 'error', 1000 )

        if ( !site.fullAddress )
            this.setMessage( 'Unable to find address for location', 'error', 1000 )

        this.waypoints.push( site )

        return this.findRoute()
    }

    DirectionsTool.prototype.addCurrentLocation = function () {
        var self = this

        return self.getCurrentLocation()
            .then( function ( res ) {
                return self.addWaypoint( res )
            } )
            .catch( function () {
                return self.setMessage( 'Unable to get current location', 'error', 1000 )
            } )
    }

    // DirectionsTool.prototype.startAtCurrentLocation = function () {
    //     var self = this

    //     return self.resetWaypoints()
    //         .then( function () {
    //             return self.getCurrentLocation()
    //                 .then( function ( res ) {
    //                     return self.addWaypoint( res )
    //                 } )
    //                 .catch( function () {
    //                     return self.setMessage( 'Unable to get current location', 'error', 1000 )
    //                 } )
    //         } )
    // }

    DirectionsTool.prototype.resetWaypoints = function ( ) {
        var self = this

        this.waypoints = []
        this.hasRoute = false

        return this.findRoute()
    }

    DirectionsTool.prototype.findRoute = function () {
        var self = this

        this.directions = []
        this.directionHighlight = null
        this.directionPick = null
        this.setMessage()
        this.clearLayers()

        var points = this.waypoints
            .map( function ( w, i ) { return { index: i, latitude: w.latitude, longitude: w.longitude } } )

        if ( points.length < 2 ) {
            self.handleRouteData()
            self.displayWaypoints()
            this.setMessage( 'Add a waypoint' )
            return SMK.UTIL.resolved()
        }

        this.setMessage( 'Constructing route...', 'progress', null )
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
        }

        return SMK.UTIL.promiseFinally( routerApi.fetchDirections( points, opt ).then( function ( data ) {
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

            self.setMessage( 'Route travels ' + data.distance + ' km in ' + data.timeText, 'summary' )

            self.hasRoute = true

            self.directions = data.directions
            
            self.directionsRaw = data
            self.directionsRaw.waypoints = JSON.parse( JSON.stringify( self.waypoints ) )
        } )
        .catch( function ( err ) {
            console.warn( err )
            self.setMessage( 'Unable to find route', 'error' )
            self.displayWaypoints()
        } ), function () {
            self.busy = false
        } )
    }

    DirectionsTool.prototype.clearLayers = function () {
        var self = this

        Object.keys( this.layer ).forEach( function ( id ) {
            self.layer[ id ].clear()
        } ) 
    }

    DirectionsTool.prototype.displaySegments = function ( segments ) {
        var self = this

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
    }

    DirectionsTool.prototype.displayWaypoints = function () {
        var self = this

        var wl = this.waypoints.length

        if ( wl > 0 )
            this.layer[ '@waypoint-start' ].load( waypointGeom( this.waypoints[ 0 ] ) )

        if ( wl > 1 )
            this.layer[ '@waypoint-end' ].load( waypointGeom( this.waypoints[ wl - 1 ] ) )

        if ( wl > 2 ) {
            self.layer[ '@waypoint-middle' ].load( turf.multiPoint( this.waypoints.slice( 1, wl - 1 ).map( function ( wp ) { return [ wp.longitude, wp.latitude ] } ) ) )
        }

        function waypointGeom( wp ) {
            return turf.point( [ wp.longitude, wp.latitude ] )
        }
    }

    return DirectionsTool
} )

