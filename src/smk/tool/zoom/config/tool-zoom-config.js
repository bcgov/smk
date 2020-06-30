include.module( 'tool-zoom-config', [
    'tool-config.tool-base-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ]( {
            type: 'zoom',
            enabled: false,
            order: 1,
            mouseWheel: true,
            doubleClick: true,
            box: true,
            control: true,
        } )
    )
} )
