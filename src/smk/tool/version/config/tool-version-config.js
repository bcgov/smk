include.module( 'tool-version-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'version',
            title: 'Version Info',
            position: 'list-menu',
            order: 99,
            icon: 'build',
            build: SMK.BUILD,
        } ) ) )
    )
} )
