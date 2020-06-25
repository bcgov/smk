include.module( 'tool-identify', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-feature-list-js', 
    'tool.tool-internal-layers-js',
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
    return SMK.TYPE.Tool.define( 'IdentifyTool', {
        construct: function () {
            SMK.TYPE.ToolWidget.call( this, 'identify-widget' )
            SMK.TYPE.ToolPanel.call( this, 'identify-panel' )
            SMK.TYPE.ToolFeatureList.call( this, function ( smk ) { return smk.$viewer.identified } )
            SMK.TYPE.ToolInternalLayers.call( this, [ 'searchAreaLayer', 'locationLayer', 'editSearchAreaLayer' ] )
        
            this.defineProp( 'tool' )
            this.defineProp( 'command' )
            this.defineProp( 'radius' )
            this.defineProp( 'radiusUnit' )

            this.tool = {}
            this.command = {}
            this.radius = 100
            this.radiusUnit = 'm'

            this.searchAreaLayer = {
                id: "@identify-search-area",
                title: "Identify Search Area",
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

            this.editSearchAreaLayer = {
                id: "@identify-edit-search-area",
                title: "Identify Edit Search Area",
                style: [
                    {
                        strokeWidth:        3,
                        strokeColor:        "red",
                        strokeOpacity:      1,
                        fill:               false,
                    }
                ],    
                legend: {
                    line: true
                }
            }
        },

        initialize: function ( smk ) {
            var self = this

            this.tool.select = smk.$tool.select
            this.tool.zoom = smk.$tool.zoom
    
            this.changedGroup( function () {
                if ( self.group ) {
                    self.displaySearchArea()
                    self.showStatusMessage( 'Click on map to identify features.' )
                }
                else {
                    self.searchArea = null
                    self.setInternalLayerVisible( false )

                    smk.$viewer.identified.clear()
                    smk.$viewer.identified.pick()
                }
            } )
    
            // fallback handler if nothing else uses pick
            smk.$viewer.handlePick( 0, function ( location ) {
                return self.startIdentify( location )
            } )
    
            smk.$viewer.handlePick( 2, function ( location ) {
                if ( !self.active ) return
    
                return self.startIdentify( location )
            } )
    
            this.getRadiusMeters = function () {
                return smk.$viewer.distanceToMeters( self.radius, self.radiusUnit ) 
            }

            this.startIdentify = function ( location ) {
                self.busy = true
                this.searchLocation = location
                
                self.showStatusMessage( 'Fetching features', 'progress', null )
                this.displaySearchArea()
                this.startedIdentify()

                var area = this.makeSearchLocationCircle( null, 16 )
                return smk.$viewer.identifyFeatures( location, area )
                    .then( function () { 
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
            
                            if ( stat.featureCount == 1 )
                                smk.$viewer.identified.pick( self.firstId )
                        }

                        return true
                    } )
                    .finally( function () {
                        self.finishedIdentify()
                    } )
            }

            this.restartIdentify = function () {
                this.startIdentify( self.searchLocation )
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
                        self.startIdentify( self.pickedLocation )
                },

                'current-location': function () {
                    self.busy = true
                    self.showStatusMessage( 'Finding current location...', 'progress', null )
        
                    return smk.$viewer.getCurrentLocation()
                        .then( function ( res ) {
                            self.busy = false
                            self.showStatusMessage()
                            return self.startIdentify( { map: res } )
                                .then( function () {
                                    smk.$viewer.panToFeature( self.searchArea, true )
                                } )
                        } )
                        .catch( function () {
                            self.busy = false
                            self.showStatusMessage( 'Unable to get current location', 'error' )
                        } )
                }
            } )
    
            var lg = L.layerGroup().addTo( smk.$viewer.map )

            this.addToMap = function ( ly, clear ) {
                if ( clear !== false )
                    lg.clearLayers()

                if ( ly )
                    lg.addLayer( ly )
            }

            this.bufferDistance = function () {
                return smk.$viewer.distanceToMeters( 20, 'px' )  
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

        events: [
            'startedIdentify',
            'finishedIdentify'    
        ],

        methods: {
            makeSearchLocationCircle: function ( radiusMeters, steps ) {
                return turf.circle( 
                    [ this.searchLocation.map.longitude, this.searchLocation.map.latitude ], 
                    ( radiusMeters || this.getRadiusMeters() ) / 1000, 
                    { steps: steps || 64 } 
                )
            },

            closestPointOnBoundary: function ( latLng ) {
                if ( !this.searchArea ) return

                var ls = turf.polygonToLine( this.searchArea )
                var pt = turf.nearestPointOnLine( ls, [ latLng.lng, latLng.lat ] )

                return [ pt.geometry.coordinates[ 1 ], pt.geometry.coordinates[ 0 ] ]
            },

            displaySearchArea: function () {
                this.trackMouse = false

                if ( !this.searchLocation ) return

                this.searchArea = this.makeSearchLocationCircle()

                this.setInternalLayerVisible( true )
                this.displayEditSearchArea()

                this.layer[ '@identify-search-area' ].clear()
                this.layer[ '@identify-search-area' ].load( this.searchArea )

                this.layer[ '@identify-location' ].clear()
                this.layer[ '@identify-location' ].load( turf.point( [ this.searchLocation.map.longitude, this.searchLocation.map.latitude ] ) )
                
                this.trackMouse = true
            },

            displayEditSearchArea: function ( editArea ) {
                this.layer[ '@identify-edit-search-area' ].clear()
                if ( editArea )
                    this.layer[ '@identify-edit-search-area' ].load( editArea )
            },

            onMouseMove: function ( ev ) {
                var self = this

                if ( !this.trackMouse ) return
                if ( !this.searchLocation ) return
                if ( ev.originalEvent.buttons ) return

                var latLong = ev.target.layerPointToLatLng( ev.layerPoint )
                var distToLocation = turf.distance( 
                    [ this.searchLocation.map.longitude, this.searchLocation.map.latitude ], 
                    llToTurf( latLong ) 
                ) * 1000

                if ( Math.abs( distToLocation - this.getRadiusMeters() ) < this.bufferDistance() ) {
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
                                self.displayEditSearchArea( self.makeSearchLocationCircle( distToLocation ) )
                            } )
                            .on( 'drag', function ( ev ) {
                                // console.log('drag',ev)
                                var rad = turf.distance( 
                                    [ self.searchLocation.map.longitude, self.searchLocation.map.latitude ], 
                                    llToTurf( ev.latlng )
                                ) * 1000
                                self.displayEditSearchArea( self.makeSearchLocationCircle( rad ) )
                            } )
                            .on( 'dragend', function (ev) {
                                // console.log('dragend',ev)
                                self.radius = turf.distance( 
                                    [ self.searchLocation.map.longitude, self.searchLocation.map.latitude ], 
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
    } )

    function llToTurf( ll ) {
        return [ ll.lng, ll.lat ]
    }
} )
