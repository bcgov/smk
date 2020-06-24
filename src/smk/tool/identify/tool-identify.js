include.module( 'tool-identify', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-feature-list-js', 
    'component-feature-list', 
    'component-command-button',
    'component-enter-input',
    'tool-identify.panel-identify-html',
    'tool-identify.crosshair-png' 
], function ( inc ) {
    "use strict";

    Vue.component( 'identify-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'identify-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-identify.panel-identify-html' ],
        props: [ 'tool', 'layers', 'highlightId', 'command', 'radius', 'radiusUnit' ],
        methods: {
            formatNumber: function ( value, fractionPlaces ) {
                var i = Math.floor( value ),
                    f = value - i

                return i.toString() + f.toFixed( fractionPlaces ).substr( 1 )
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'IdentifyTool', 
        function () {
            SMK.TYPE.ToolWidget.call( this, 'identify-widget' )
            SMK.TYPE.ToolPanel.call( this, 'identify-panel' )
            SMK.TYPE.ToolFeatureList.call( this, function ( smk ) { return smk.$viewer.identified } )
        
            this.defineProp( 'tool' )
            this.defineProp( 'command' )
            this.defineProp( 'radius' )
            this.defineProp( 'radiusUnit' )

            this.tool = {}
            this.command = {}
            this.radius = 100
            this.radiusUnit = 'm'

            this.boundaryLayer = {
                id: "@identify-boundary",
                title: "Identify Boundary",
                style: [
                    {
                        stroke:             false,
                        fillColor:          "white",
                        fillOpacity:        0.5,
                    },
                    {
                        strokeWidth:        6,
                        strokeColor:        "black",
                        strokeOpacity:      1,
                        strokeCap:          "butt",
                        strokeDashes:       "6,6",
                        strokeDashOffset:   6,
                        fill:               false,
                    },
                    {
                        strokeWidth:        6,
                        strokeColor:        "white",
                        strokeOpacity:      1,
                        strokeCap:          "butt",
                        strokeDashes:       "6,6",
                        fill:               false,
                    }
                ],    
                legend: {
                    line: true
                }
            }

            this.locationLayer = {
                id: "@identify-location",
                title: "Identify Location",
                style: {
                    markerUrl: inc[ 'tool-identify.crosshair-png' ],
                    markerSize: [ 40, 40 ],
                    markerOffset: [ 20, 20 ]    
                },
                legend: {
                    point: true
                }
            }

        },
        function ( smk ) {
            var self = this

            this.tool.select = smk.$tool.select
            this.tool.zoom = smk.$tool.zoom
    
            self.showStatusMessage( 'Click on map to identify features.' )
    
            self.changedGroup( function () {
                if ( self.group ) {
                    self.displayBoundary()
                }
                else {
                    self.boundary = null
                    self.setInternalLayerVisible( false )

                    smk.$viewer.identified.clear()
                    smk.$viewer.identified.pick()
                }
            } )
    
            // fallback handler if nothing else uses pick
            smk.$viewer.handlePick( 0, function ( location ) {
                return startIdentify( location )
            } )
    
            smk.$viewer.handlePick( 2, function ( location ) {
                if ( !self.active ) return
    
                return startIdentify( location )
            } )
    
            var startIdentify = function ( location ) {
                // self.pickedLocation = null
                self.pickedLocation = location

                self.radiusKM = smk.$viewer.distanceToMeters( self.radius, self.radiusUnit ) / 1000
                self.boundary = turf.circle( [ location.map.longitude, location.map.latitude ], self.radiusKM, { steps: 64 } )
                
                self.displayBoundary()

                return smk.$viewer.identifyFeatures( location, turf.circle( [ location.map.longitude, location.map.latitude ], self.radiusKM, { steps: 16 } ) )
                    .then( function () { 
                        // self.pickedLocation = location
                        return true
                    } )
            }

            self.restartIdentify = function () {
                startIdentify( self.pickedLocation )
            }
    
            smk.on( this.id, {  
                'add-all': function ( ev ) {
                    var lyfts = self.layers.map( function ( ly ) {
                        return [ ly.id, ly.features.map( function ( ft ) {
                            return smk.$viewer.identified.get( ft.id )
                        } ) ] 
                    } )

                    lyfts.forEach( function ( lf ) {
                        smk.$viewer.selected.add.apply( smk.$viewer.selected, lf )
                    } )
                },
    
                'clear': function ( ev ) {
                    self.showStatusMessage( 'Click on map to identify features.' )
                },
    
                'swipe-up': function ( ev ) {                
                    smk.$sidepanel.setExpand( 2 )
                },
    
                'swipe-down': function ( ev ) {
                    smk.$sidepanel.incrExpand( -1 )
                },

                'change': function ( ev, comp ) {
                    Object.assign( self, ev )
    
                    if ( self.pickedLocation )
                        startIdentify( self.pickedLocation )
                },

                'current-location': function () {
                    self.busy = true
                    self.showStatusMessage( 'Finding current location...', 'progress', null )
        
                    return smk.$viewer.getCurrentLocation()
                        .then( function ( res ) {
                            self.busy = false
                            self.showStatusMessage()
                            return startIdentify( { map: res } )
                                .then( function () {
                                    smk.$viewer.panToFeature( self.boundary, true )
                                } )
                        } )
                        .catch( function () {
                            self.busy = false
                            return self.showStatusMessage( 'Unable to get current location', 'error' )
                        } )
                }
            } )
    
            smk.$viewer.startedIdentify( function ( ev ) {
                self.busy = true
                self.firstId = null
                // self.active = true
                self.showStatusMessage( 'Fetching features', 'progress', null )
            } )
    
            smk.$viewer.finishedIdentify( function ( ev ) {
                self.busy = false
    
                if ( smk.$viewer.identified.isEmpty() ) {
                    smk.$sidepanel.setExpand( 0 )
                    self.setInternalLayerVisible( false )
                    self.showStatusMessage( 'No features found', 'warning' )
                }
                else {
                    self.active = true
                    var stat = smk.$viewer.identified.getStats()
    
                    var sub = SMK.UTIL.grammaticalNumber( stat.layerCount, null, null, 'on {} layers' )
                    // if ( stat.vertexCount > stat.featureCount )
                    //     sub += ( sub == '' ? '' : ', ' ) + SMK.UTIL.grammaticalNumber( stat.vertexCount, null, null, 'with {} vertices' )
                    if ( sub != '' ) sub = '<div>' + sub + '</div>'
    
                    self.showStatusMessage( '<div>Identified ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' + sub )
    
                    if ( stat.featureCount == 1 ) {
                        var id = Object.keys( smk.$viewer.identified.featureSet )[ 0 ]
                        smk.$viewer.identified.pick( id )
                    }
                }
            } )

            this.layer = {}
            var groupItems = []
            var ly = this.boundaryLayer
            ly.type = 'vector'
            ly.isVisible = true
            ly.isQueryable = false
            ly.isInternal = true
            var display = smk.$viewer.addLayer( ly )
            display.class = "smk-inline-legend"            

            groupItems.push( { id: display.id } )

            self.layer[ ly.id ] = smk.$viewer.layerId[ ly.id ]

            ly = this.locationLayer
            ly.type = 'vector'
            ly.isVisible = true
            ly.isQueryable = false
            ly.isInternal = true
            display = smk.$viewer.addLayer( ly )
            display.class = "smk-inline-legend"            

            groupItems.unshift( { id: display.id } )

            self.layer[ ly.id ] = smk.$viewer.layerId[ ly.id ]

            smk.$viewer.setDisplayContextItems( this.id, [ {
                id: 'tool-' + this.id,
                type: 'group',
                title: this.title,
                isVisible: false,
                isInternal: true,
                items: groupItems
            } ] )

            this.setInternalLayerVisible = function ( visible ) {
                smk.$viewer.displayContext[ self.id ].setItemVisible( 'tool-' + self.id, visible )
            }

            var lg = L.layerGroup().addTo( smk.$viewer.map )

            this.addToMap = function ( ly, clear ) {
                if ( clear !== false )
                    lg.clearLayers()

                if ( ly )
                    lg.addLayer( ly )
            }

            this.bufferDistance = function () {
                return smk.$viewer.distanceToMeters( 20, 'px' ) / 1000                
            }

            this.trackMouse = false
            smk.$viewer.map.on( 'mousemove', function ( ev ) { self.onMouseMove( ev ) } )

            this.getCurrentLocation = function () {
                self.busy = true
                self.showStatusMessage( 'Finding current location...', 'progress', null )
    
                return smk.$viewer.getCurrentLocation().finally( function () {
                    self.busy = false
                    self.showStatusMessage()
                } )
            }
        },
        {
            getLocation: function () {
                return this.pickedLocation.map
            },

            closestPointOnBoundary: function ( latLng ) {
                if ( !this.boundary ) return

                var ls = turf.polygonToLine( this.boundary )
                var pt = turf.nearestPointOnLine( ls, [ latLng.lng, latLng.lat ] )

                return [ pt.geometry.coordinates[ 1 ], pt.geometry.coordinates[ 0 ] ]
            },

            displayBoundary: function () {
                var self = this
        
                this.trackMouse = false
                if ( !this.boundary ) return

                this.setInternalLayerVisible( true )
                
                this.layer[ '@identify-boundary' ].clear()
                this.layer[ '@identify-boundary' ].load( this.boundary )

                this.layer[ '@identify-location' ].clear()
                this.layer[ '@identify-location' ].load( turf.point( [ this.pickedLocation.map.longitude, this.pickedLocation.map.latitude ] ) )
                
                this.trackMouse = true
            },

            onMouseMove: function ( ev ) {
                var self = this

                if ( !this.trackMouse ) return
                if ( !this.pickedLocation ) return
                if ( ev.originalEvent.buttons ) return

                var latLong = ev.target.layerPointToLatLng( ev.layerPoint )
                var distToLocation = turf.distance( 
                    [ this.pickedLocation.map.longitude, this.pickedLocation.map.latitude ], 
                    llToTurf( latLong ) 
                )

                if ( Math.abs( distToLocation - this.radiusKM ) < this.bufferDistance() ) {
                    var pos = this.closestPointOnBoundary( latLong )
                    if ( !this.marker ) {
                        this.marker = L.marker( pos, {
                                icon: L.divIcon( {
                                    className: 'smk-drag-handle',
                                    iconSize: [ 10, 10 ],
                                    iconAnchor: [ 5, 5 ]
                                } ),
                                bubblingMouseEvents: true,
                                draggable: true
                            } )
                            .on( 'dragstart', function (ev) {
                                // console.log('dragstart',ev)
                                self.trackMouse = false
                                self.newBoundary = L.GeoJSON.geometryToLayer( turf.circle( [ self.pickedLocation.map.longitude, self.pickedLocation.map.latitude ], distToLocation, { steps: 64 } ), {
                                    color: 'red',
                                    width: 2,
                                } )
                                self.addToMap( self.newBoundary, false )                
                            } )
                            .on( 'drag', function ( ev ) {
                                // console.log('drag',ev)
                                var rad = turf.distance( 
                                    [ self.pickedLocation.map.longitude, self.pickedLocation.map.latitude ], 
                                    llToTurf( ev.latlng )
                                )
                                self.newBoundary.remove()
                
                                self.newBoundary = L.GeoJSON.geometryToLayer( turf.circle( [ self.pickedLocation.map.longitude, self.pickedLocation.map.latitude ], rad, { steps: 64 } ), {
                                    color: 'red',
                                    width: 2,
                                } )
                                self.addToMap( self.newBoundary, false )
                                                
                            } )
                            .on( 'dragend', function (ev) {
                                // console.log('dragend',ev)
                                self.radius = turf.distance( 
                                    [ self.pickedLocation.map.longitude, self.pickedLocation.map.latitude ], 
                                    llToTurf( ev.target.getLatLng() )
                                ) * 1000
                                self.addToMap( self.marker )
                                self.restartIdentify()
                            } )
                        
                        this.addToMap( this.marker, false )
                    }
                    else {
                        this.marker.setLatLng( pos )
                    }        
                }
                else {
                    if ( this.marker ) {
                        this.marker.remove()
                        this.marker = null
                    }
                }
            }
        }
    )

    function llToTurf( ll ) {
        return [ ll.lng, ll.lat ]
    }
} )
