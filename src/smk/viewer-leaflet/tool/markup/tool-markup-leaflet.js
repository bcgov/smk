include.module( 'tool-markup-leaflet', [ 'leaflet', 'tool-markup' ], function () {
    "use strict";

    SMK.TYPE.MarkupTool.addInitializer( function ( smk ) {
        if ( smk.$device == 'mobile' ) return

        smk.$viewer.map.pm.setGlobalOptions({ templineStyle: { color: 'purple' }, hintlineStyle: { color: 'orange', dashArray: [15, 5] } });

        smk.$viewer.map.pm.addControls( {
            // Options are defined in https://github.com/geoman-io/leaflet-geoman#leaflet-geoman-toolbar
            position: 'topright', 
            drawRectangle: false,  
            drawCircleMarker: false,
            dragMode: false,
            cutPolygon: false,
            rotateMode: false
        } );
    } )
} )
