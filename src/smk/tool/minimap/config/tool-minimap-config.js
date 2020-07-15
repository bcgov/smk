include.module( 'tool-minimap-config', [
    'tool-config.tool-base-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ]( {
            type: 'minimap',
            order: 1
        } )
    )
} )
