include.module( 'tool-markup-leaflet', [ 'leaflet', 'tool-markup' ], function () {
    "use strict";

    SMK.TYPE.MarkupTool.addInitializer( function ( smk ) {
        if ( smk.$device == 'mobile' ) return

        this.setDefaultDrawStyle();
        this.addMarkupToolbar();
    } )
} )
