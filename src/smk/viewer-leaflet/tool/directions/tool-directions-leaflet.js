include.module( 'tool-directions-leaflet', [ 'leaflet', 'tool-directions' ], function ( inc ) {
    "use strict";

    SMK.TYPE.DirectionsWaypointsTool.addInitializer( function ( smk ) {
        var self = this

        this.changedGroup( function () {
            self.visible = self.group
        } )

        this.changedVisible( function () {
            if ( self.visible ) {
                if ( self.directionHighlightLayer )
                    smk.$viewer.map.addLayer( self.directionHighlightLayer )

                if ( self.directionPickLayer )
                    smk.$viewer.map.addLayer( self.directionPickLayer )
            }
            else {
                if ( self.directionHighlightLayer )
                    smk.$viewer.map.removeLayer( self.directionHighlightLayer )

                if ( self.directionPickLayer )
                    smk.$viewer.map.removeLayer( self.directionPickLayer )
            }
        } )

        function reset() {
            if ( self.directionHighlightLayer )
                smk.$viewer.map.removeLayer( self.directionHighlightLayer )
            self.directionHighlightLayer = null

            if ( self.directionPickLayer )
                smk.$viewer.map.removeLayer( self.directionPickLayer )
            self.directionPickLayer = null
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

} )
