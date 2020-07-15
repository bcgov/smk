include.module( 'tool-toolbar-config', [
    'tool-config.tool-base-config-js'
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ]( {
            type: 'toolbar',
            enabled: true
        } )
    )
} )
