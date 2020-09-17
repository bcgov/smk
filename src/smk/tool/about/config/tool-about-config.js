include.module( 'tool-about-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'about',
            enabled: false,
            order: 1,
            icon: 'help',
            position: 'list-menu',
            title: 'About SMK',
            content: 'Welcome to SMK'
        } ) ) )
    )
} )
