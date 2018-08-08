include.module( 'tool-minimap-leaflet', [ 'leaflet', 'tool-minimap' ], function () {
    "use strict";

    SMK.TYPE.MinimapTool.prototype.afterInitialize.push( function ( smk ) {
        smk.addToStatus( $( '<div class="smk-spacer">' ).height( 170 ).get( 0 ) )

        var ly = smk.$viewer.createBasemapLayer( this.baseMap || "Topographic" );

        ( new L.Control.MiniMap( ly[ 0 ], { toggleDisplay: true } ) )
            .addTo( smk.$viewer.map );
    } )

} )
