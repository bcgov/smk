include.module( 'tool-config.tool-widget-config-js', [], function ( inc ) {
    "use strict";

    return function ( cfg ) {
        return Object.assign( {
            showWidget: true,
        }, cfg )
    }
} )
