include.module( 'tool-shortcut-menu-config', [
    'tool-config.tool-base-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ]( {
            type: 'shortcut-menu',
            order: 10
        } )
    )
} )
