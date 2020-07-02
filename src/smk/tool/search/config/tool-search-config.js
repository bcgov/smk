include.module( 'tool-search-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'search',
            enabled: true,
            order: 2,
            position: 'toolbar',
            icon: 'search',
            title: 'Search for Location',
            showPanel: true,
            showLocation: true,
            command: {
                identify: true,
                measure: true,
                directions: true,
            }
        } ) ) )
    )
} )
