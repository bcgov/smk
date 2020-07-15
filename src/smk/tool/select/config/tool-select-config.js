include.module( 'tool-select-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
    'tool-config.tool-panel-feature-config-js'
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ](
        inc[ 'tool-config.tool-panel-feature-config-js' ]( {
            type: 'select',
            enabled: false,
            order: 6,
            position: 'list-menu',
            icon: 'select_all',
            title: 'Selected Features',
            command: {
                clear: true,
                remove: true,
            }
        } ) ) ) )
    )
} )
