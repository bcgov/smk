include.module( 'tool-config.tool-panel-feature-config-js', [], function ( inc ) {
    "use strict";

    return function ( cfg ) {
        return Object.assign( {
            attributeView: 'default',
            command: {
                navigator: true,
                zoom: true,
                select: true,
                attributeMode: true,
            }
        }, cfg )
    }
} )
