include.module( 'tool-zoom-leaflet', [ 'tool-zoom', 'leaflet' ], function () {
    "use strict";

    SMK.TYPE.ZoomTool.prototype.afterInitialize.push( function ( smk ) {
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
        }
    } )

} )

