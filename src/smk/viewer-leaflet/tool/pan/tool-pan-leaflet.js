include.module( 'tool-pan-leaflet', [ 'tool-pan', 'leaflet' ], function () {
    "use strict";

    SMK.TYPE.PanTool.addInitializer( function ( smk ) {
        smk.$viewer.map.dragging.enable()
    } )
} )

