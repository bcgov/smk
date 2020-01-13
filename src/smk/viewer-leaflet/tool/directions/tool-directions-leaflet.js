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

        this.changedGroup( function () {
            self.visible = self.group
        } )

        this.changedVisible( function () {
            if ( self.visible ) {
                if ( self.routeLayer )
                    smk.$viewer.map.addLayer( self.routeLayer )

                if ( self.directionHighlightLayer )
                    smk.$viewer.map.addLayer( self.directionHighlightLayer )

                if ( self.directionPickLayer )
                    smk.$viewer.map.addLayer( self.directionPickLayer )

                if ( self.waypointLayers && self.waypointLayers.length > 0 ) {
                    self.waypointLayers.forEach( function ( l ) {
                        smk.$viewer.map.addLayer( l )
                    } )
                }
            }
            else {
                if ( self.routeLayer )
                    smk.$viewer.map.removeLayer( self.routeLayer )

                if ( self.directionHighlightLayer )
                    smk.$viewer.map.removeLayer( self.directionHighlightLayer )

                if ( self.directionPickLayer )
                    smk.$viewer.map.removeLayer( self.directionPickLayer )

                if ( self.waypointLayers && self.waypointLayers.length > 0 ) {
                    self.waypointLayers.forEach( function ( l ) {
                        smk.$viewer.map.removeLayer( l )
                    } )
                }
            }
        } )


        // TODO remove
        // this.displayRoute = function ( points ) {
        //     reset()

        //     if ( !points ) return

        //     self.routeLayer = L.geoJson( 
        //         {
        //             type: "Feature",
        //             geometry: {
        //                 type: "LineString",
        //                 coordinates: points
        //             }
        //         }, 
        //         {
        //             pane: 'markerPane',
        //             onEachFeature: function( feature, layer ) {
        //                 var color = "#0000FF";
        //                 layer.setStyle( { color:color, weight:7, opacity: 0.5 } );
        //             }
        //         } 
        //     )

        //     smk.$viewer.map.addLayer( self.routeLayer )

        //     var bounds = self.routeLayer.getBounds()
        //     var padding = smk.$viewer.getPanelPadding( true )

        //     smk.$viewer.map.fitBounds( bounds.pad( 0.25 ), {
        //         paddingTopLeft: padding.topLeft,
        //         paddingBottomRight: padding.bottomRight
        //     } )
        // }

        this.displaySegments = function ( segments ) {
            reset()

            if ( !segments || segments.length == 0 ) return

            self.routeLayer = L.geoJson( segments, {
                pane: 'markerPane',
                onEachFeature: function( feature, layer ) {
                    layer.setStyle( convertStyle( feature.style ) )
                }
            } )

            smk.$viewer.map.addLayer( self.routeLayer )

            var bounds = self.routeLayer.getBounds()
            var padding = smk.$viewer.getPanelPadding( true )

            smk.$viewer.map.fitBounds( bounds.pad( 0.25 ), {
                paddingTopLeft: padding.topLeft,
                paddingBottomRight: padding.bottomRight
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
                            icon: icon
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

        smk.on( 'directions-route', {
            'hover-direction': function ( ev ) {
                if ( self.directionHighlightLayer ) {
                    smk.$viewer.map.removeLayer( self.directionHighlightLayer )
                    self.directionHighlightLayer = null
                }

                if ( ev.highlight == null ) return

                var p = self.directions[ ev.highlight ].point
                self.directionHighlightLayer = L.circleMarker( [ p[ 1 ], p[ 0 ] ] )
                    .addTo( smk.$viewer.map )
            },

            'pick-direction': function ( ev ) {
                if ( self.directionPickLayer ) {
                    smk.$viewer.map.removeLayer( self.directionPickLayer )
                    self.directionPickLayer = null
                }

                if ( ev.pick == null ) return

                var p = self.directions[ ev.pick ].point
                self.directionPickLayer = L.circleMarker( [ p[ 1 ], p[ 0 ] ], { radius: 15 } )
                    .addTo( smk.$viewer.map )

                zoomToPoint( p )
            },
        } )

        function zoomToPoint( point, maxZoom ) {
            var ll = L.latLng( point[ 1 ], point[ 0 ] )
            var bounds = L.latLngBounds( [ ll, ll ] )
            var padding = smk.$viewer.getPanelPadding( true )

            smk.$viewer.map
                .fitBounds( bounds, {
                    paddingTopLeft: padding.topLeft,
                    paddingBottomRight: padding.bottomRight,
                    maxZoom: maxZoom || 15,        
                    animate: true
                } )
        }

        smk.on( this.id, {
            'clear': function ( ev ) {
                reset()
            },

            'zoom-waypoint': function ( ev ) {
                zoomToPoint( [ ev.waypoint.longitude, ev.waypoint.latitude ] )
            }
        } )
    } )

    function convertStyle( styleConfig, type ) {
        if ( type == 'Point' || type == 'MultiPoint' )
            return {
                radius:      styleConfig.strokeWidth / 2,
                color:       styleConfig.strokeColor,
                weight:      2,
                opacity:     styleConfig.strokeOpacity,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
            }
        else
            return {
                // stroke:      true,
                color:       styleConfig.strokeColor,
                weight:      styleConfig.strokeWidth,
                opacity:     styleConfig.strokeOpacity,
                lineCap:     styleConfig.strokeCap,
                // lineJoin:    styleConfig.,
                dashArray:   styleConfig.strokeDashes,
                // dashOffset:  styleConfig.,
                // fill:        styleConfig.,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
                // fillRule:    styleConfig.,
            }
    }

} )
