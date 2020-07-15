include.module( 'tool-query-config', [
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
            type: 'query',
            instance: true,
            order: 5,
            within: false,
            command: {
                within: true,
                select: true,
            },
        } ) ) ) )
    )
} )
