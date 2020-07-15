include.module( 'tool-identify-leaflet', [
    'leaflet',
    'tool-identify',
    'tool-leaflet',
    'tool-leaflet.tool-feature-list-leaflet-js'
], function ( inc ) {
    "use strict";

    SMK.TYPE.IdentifyListTool.addInitializer( function ( smk ) {
        var self = this

        inc[ 'tool-leaflet.tool-feature-list-leaflet-js' ].call( this, smk )

        var lg = L.layerGroup().addTo( smk.$viewer.map )

        this.clearMarker = function () {
            lg.clearLayers()
        }

        var marker

        smk.$viewer.map.on( 'mousemove', function ( ev ) {
            if ( !self.trackMouse ) return
            if ( !self.searchLocation ) return
            if ( ev.originalEvent.buttons ) return

            var latLong = ev.target.layerPointToLatLng( ev.layerPoint )
            var distToLocation = turf.distance(
                [ self.searchLocation.map.longitude, self.searchLocation.map.latitude ],
                llToTurf( latLong )
            ) * 1000

            if ( Math.abs( distToLocation - self.getRadiusMeters() ) < self.bufferDistance() ) {
                var pos = self.closestPointOnBoundary( latLong )

                if ( !marker ) {
                    marker = L.marker( pos, {
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
                            self.setRadiusMeters( turf.distance(
                                [ self.searchLocation.map.longitude, self.searchLocation.map.latitude ],
                                llToTurf( ev.target.getLatLng() )
                            ) * 1000 )

                            self.restartIdentify()
                        } )

                    lg.addLayer( marker )
                }
                else {
                    marker.setLatLng( pos )
                }
            }
            else {
                if ( marker ) {
                    marker.remove()
                    marker = null
                }
            }
        } )
    } )

    function llToTurf( ll ) {
        return [ ll.lng, ll.lat ]
    }

} )
