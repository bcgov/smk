include.module( 'tool-layers-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'layers',
            enabled: false,
            order: 3,
            position: [ 'shortcut-menu', 'list-menu' ],
            icon: 'layers',
            title: 'Layers',
            command: {
                allVisibility: true,
                filter: true,
                legend: true,
            },
            glyph: {
                visible: 'visibility',
                hidden: 'visibility_off',
            }
        } ) ) )
    )
} )
