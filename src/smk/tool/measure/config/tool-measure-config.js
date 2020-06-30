include.module( 'tool-measure-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js'
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'measure',
            order: 6,
            position: [ 'shortcut-menu', 'list-menu' ],
            icon: 'straighten',
            title: 'Measurement'
        } ) ) )
    )
} )
