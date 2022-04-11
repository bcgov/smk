include.module( 'tool-minimap-leaflet', [ 'leaflet', 'tool-minimap' ], function () {
    "use strict";

    SMK.TYPE.MinimapTool.addInitializer( function ( smk ) {
        if ( smk.$device == 'mobile' ) return

        smk.addToStatus( $( '<div class="smk-spacer">' ).height( 170 ).get( 0 ) )

        var ly = smk.$viewer.createBasemapLayer( smk.viewer.esriApiKey, this.baseMap || "Topographic" );

        ( new L.Control.MiniMap( ly[ 0 ], { toggleDisplay: true } ) )
            .addTo( smk.$viewer.map );
    } )

} )
