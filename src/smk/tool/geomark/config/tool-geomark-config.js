include.module( 'tool-geomark-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'geomark',
            title: 'Geomark',
            position: 'list-menu',
            icon: 'build',
            build: SMK.BUILD,
        } ) ) )
    )
} )
