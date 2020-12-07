include.module( 'tool-zoom-leaflet', [ 'tool-zoom', 'leaflet' ], function () {
    "use strict";

    SMK.TYPE.ZoomTool.addInitializer( function ( smk ) {
        // if ( smk.$device == 'mobile' ) return

        if ( this.mouseWheel !== false ) {
            smk.$viewer.map.scrollWheelZoom.enable()
        }

        if ( this.doubleClick !== false ) {
            smk.$viewer.map.doubleClickZoom.enable()
        }

        if ( this.box !== false ) {
            smk.$viewer.map.boxZoom.enable()
        }

        if ( this.control !== false ) {
            L.control.zoom( {
                position: 'topright'
            } ).addTo( smk.$viewer.map )

            smk.addToStatus( $( '<div class="smk-spacer" style="order: 1; height: 70px; flex-shrink: 0">' ).get( 0 ) )
        }
    } )
} )

