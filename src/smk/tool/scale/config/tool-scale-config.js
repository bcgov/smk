include.module( 'tool-scale-config', [
    'tool-config.tool-base-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ]( {
            type: 'scale',
            order: 2,
            showFactor: true,
            showBar: true,
            showZoom: false,
        } )
    )
} )
