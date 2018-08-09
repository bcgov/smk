include.module( 'tool-directions-leaflet', [ 'leaflet', 'tool-directions' ], function ( inc ) {
    "use strict";

    var base = include.option( 'baseUrl' ) + '/images/tool/directions'

    var redIcon = new L.Icon( {
        iconUrl:        base + '/marker-icon-red.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    var greenIcon = new L.Icon( {
        iconUrl:        base + '/marker-icon-green.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    L.NumberedIcon = L.Icon.extend( {
        options: {
            number:         '',
            iconUrl:        base + '/marker-icon-hole.png',
            shadowUrl:      base + '/marker-shadow.png',
            iconSize:       [ 25, 41 ],
            iconAnchor:     [ 13, 41 ],
            popupAnchor:    [ 0, -33 ],
            shadowSize:     [ 41, 41 ]
        },

        createIcon: function () {
            var div = document.createElement( 'div' )
            var img = this._createImg( this.options.iconUrl )
            var numdiv = document.createElement( 'div' )
            numdiv.setAttribute ( 'class', 'number' )
            numdiv.innerHTML = this.options.number || ''
            div.appendChild ( img )
            div.appendChild ( numdiv )
            this._setIconStyles( div, 'icon' )
            return div
        }
    } )


    SMK.TYPE.DirectionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.changedActive( function () {
            if ( self.active ) {
            }
            else {
                reset()
            }
        } )

        this.displayRoute = function ( points ) {
            reset()

            if ( !points ) return

            self.routeLayer = L.geoJson( {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: points
                }
            }, {
                onEachFeature: function( feature, layer ) {
                    var color = "#0000FF";
                    layer.setStyle( { color:color, weight:7, opacity: 0.5 } );
                }
            } )

            smk.$viewer.map.addLayer( self.routeLayer )

            var bounds = self.routeLayer.getBounds()

            smk.$viewer.map.fitBounds( bounds.pad( 0.25 ), {
                paddingTopLeft: L.point( 340, 40 ),
                paddingBottomRight: L.point( 40, 40 )
            } )
        }

        this.displayWaypoints = function () {
            if ( self.waypointLayers && self.waypointLayers.length > 0 ) {
                self.waypointLayers.forEach( function ( l ) {
                    smk.$viewer.map.removeLayer( l )
                } )
            }

            var last = self.waypoints.length - 1
            self.waypointLayers = self.waypoints
                .map( function ( w, i ) {
                    var icon
                    var popup = Object.assign( {
                        index: i
                    }, w )

                    switch ( i ) {
                    case 0:
                        icon = greenIcon
                        popup.first = true
                        break;

                    case last:
                        icon = redIcon
                        popup.last = true
                        break;

                    default:
                        icon = new L.NumberedIcon( { number: i } )
                        break;
                    }

                    return L.marker( [ w.latitude, w.longitude ], {
                            // title: w.fullAddress,
                            icon: icon
                        } )
                        .bindPopup( function () {
                            self.popupModel.site = popup
                            return self.popupVm.$el
                        }, {
                            maxWidth: 100,
                            autoPanPaddingTopLeft: L.point( 340, 40 ),
                            autoPanPaddingBottomRight: L.point( 40, 40 )
                        } )
                        .addTo( smk.$viewer.map )
                } )
        }

        function reset() {
            if ( self.routeLayer )
                smk.$viewer.map.removeLayer( self.routeLayer )
            self.routeLayer = null

            if ( self.directionHighlightLayer )
                smk.$viewer.map.removeLayer( self.directionHighlightLayer )
            self.directionHighlightLayer = null

            if ( self.directionPickLayer )
                smk.$viewer.map.removeLayer( self.directionPickLayer )
            self.directionPickLayer = null

            if ( self.waypointLayers && self.waypointLayers.length > 0 ) {
                self.waypointLayers.forEach( function ( l ) {
                    smk.$viewer.map.removeLayer( l )
                } )
            }
            self.waypointLayers = null
        }

        smk.on( this.id, {
            'hover-direction': function ( ev ) {
                if ( self.directionHighlightLayer ) {
                    smk.$viewer.map.removeLayer( self.directionHighlightLayer )
                    self.directionHighlightLayer = null
                }

                if ( ev.highlight == null ) return

                var p = self.directions[ ev.highlight ].point
                self.directionHighlightLayer = L.circleMarker( [ p[ 1 ], p[ 0 ] ] )
                    .bindPopup( function () {
                        self.popupModel.site = self.directions[ ev.highlight ]
                        return self.popupVm.$el
                    }, {
                        closeButton: false,
                        maxWidth: 100,
                        autoPanPaddingTopLeft: L.point( 340, 40 ),
                        autoPanPaddingBottomRight: L.point( 40, 40 )
                    } )
                    .addTo( smk.$viewer.map )
                    .openPopup()
            },

            'pick-direction': function ( ev ) {
                if ( self.directionPickLayer ) {
                    smk.$viewer.map.removeLayer( self.directionPickLayer )
                    self.directionPickLayer = null
                }

                if ( ev.pick == null ) return

                var p = self.directions[ ev.pick ].point
                self.directionPickLayer = L.circleMarker( [ p[ 1 ], p[ 0 ] ], { radius: 15 } )
                    .bindPopup( function () {
                        self.popupModel.site = self.directions[ ev.pick ]
                        return self.popupVm.$el
                    }, {
                        maxWidth: 100,
                        autoPanPaddingTopLeft: L.point( 340, 40 ),
                        autoPanPaddingBottomRight: L.point( 40, 40 )
                    } )
                    .addTo( smk.$viewer.map )
                    .openPopup()

                smk.$viewer.map.panTo( [ p[ 1 ], p[ 0 ] ] )
            },

            'clear': function ( ev ) {
                reset()
            },

            'zoom-waypoint': function ( ev ) {
                smk.$viewer.map.flyTo( [ ev.waypoint.latitude, ev.waypoint.longitude ], 12 )
                self.waypointLayers[ ev.index ].openPopup()
            }
        } )
    } )


} )
