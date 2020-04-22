include.module( 'tool-directions-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'tool-directions' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    var base = include.option( 'baseUrl' ) + 'images/tool/directions'

    var redSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-shadow.png',
                }
            },
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-icon-red.png',
                }
            }
        ]
    }

    var greenSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-shadow.png',
                }
            },
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-icon-green.png',
                }
            }
        ]
    }

    var blueSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-shadow.png',
                }
            },
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-icon-hole.png',
                }
            }
        ]
    }

    SMK.TYPE.DirectionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.directionsLayer = new E.layers.GraphicsLayer( { visible: false } )
        smk.$viewer.map.add( self.directionsLayer )

        this.changedActive( function () {
            self.visible = self.active
        } )

        this.changedVisible( function () {
            self.directionsLayer.visible = self.visible
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            return smk.$viewer.view.hitTest( location.screen )
                .then( function ( hit ) {
                    // console.log( arguments  )
                    if ( hit.results.length == 0 ) return
                    if ( !hit.results[ 0 ].graphic ) return

                    return true
                } )
        } )

        var styleRoute = SMK.UTIL.smkStyleToEsriSymbol( {
                strokeColor: '#0000FF',
                strokeOpacity: 0.5,
                strokeWidth: 7,
            } ),
            styleRouteFn = function ( type ) { return styleRoute[ type ] }

        this.displayRoute = function ( points ) {
            reset()

            if ( !points ) return

            var geojson = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: points
                }
            }

            self.routeGraphic = new E.Graphic( SMK.UTIL.geoJsonToEsriGeometry( geojson, styleRouteFn )[ 0 ] )

            self.directionsLayer.add( self.routeGraphic )

            smk.$viewer.view.goTo( self.routeGraphic )
        }

        this.displayWaypoints = function () {
            var last = self.waypoints.length - 1
            self.waypointGraphics = self.waypoints
                .map( function ( w, i ) {
                    var symbol
                    var popup = Object.assign( {
                        index: i
                    }, w )

                    switch ( i ) {
                    case 0:
                        symbol = greenSymbol
                        popup.first = true
                        break;

                    case last:
                        symbol = redSymbol
                        popup.last = true
                        break;

                    default:
                        symbol = blueSymbol
                        break;
                    }

                    return new E.Graphic( {
                        geometry: { type: 'point', latitude: w.latitude, longitude: w.longitude },
                        symbol: symbol,
                        attributes: popup
                    } )
                } )

            self.directionsLayer.addMany( self.waypointGraphics )
        }

        function reset() {
            self.directionsLayer.removeAll()
        }

        smk.on( 'directions-route', {
            'hover-direction': function ( ev ) {
                self.directionsLayer.remove( self.highlightGraphic )

                if ( ev.highlight == null ) return

                var p = self.directions[ ev.highlight ].point
                var g = { type: 'point', latitude: p[ 1 ], longitude: p[ 0 ] }

                self.highlightGraphic = new E.Graphic( {
                    geometry: g,
                    symbol: {
                        type: 'point-3d',
                        symbolLayers: [
                            {
                                type:       'icon',
                                size:       '20px',
                                anchor:     'center',
                                material: {
                                    color: [ 0, 0, 0, 0 ]
                                },
                                resource: {
                                    primitive: 'circle'
                                },
                                outline: {
                                    color: 'blue',
                                    size: '2px'
                                }
                            }
                        ]
                    }
                } )

                self.directionsLayer.add( self.highlightGraphic )
            },

            'pick-direction': function ( ev ) {
                self.directionsLayer.remove( self.pickGraphic )

                if ( ev.pick == null ) return

                var p = self.directions[ ev.pick ].point
                var g = { type: 'point', latitude: p[ 1 ], longitude: p[ 0 ] }

                self.pickGraphic = new E.Graphic( {
                    geometry: g,
                    symbol: {
                        type: 'point-3d',
                        symbolLayers: [
                            {
                                type:       'icon',
                                size:       '30px',
                                anchor:     'center',
                                material: {
                                    color: [ 0, 0, 0, 0 ]
                                },
                                resource: {
                                    primitive: 'circle'
                                },
                                outline: {
                                    color: 'blue',
                                    size: '2px'
                                }
                            }
                        ]
                    }
                } )

                self.directionsLayer.add( self.pickGraphic )

                smk.$viewer.view.goTo( { center: p, zoom: 12 } )
            },
        } )

        smk.on( this.id, {
            'clear': function ( ev ) {
                reset()
            },

            'zoom-waypoint': function ( ev ) {
                var gr = self.waypointGraphics[ ev.index ]
                var w = ev.waypoint

                smk.$viewer.view.goTo( { center: [ w.longitude, w.latitude ], zoom: 12 } )
            }
        } )
    } )


} )
