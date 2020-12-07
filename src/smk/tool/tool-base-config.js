include.module( 'tool-config.tool-base-config-js', [], function ( inc ) {
    "use strict";

    return function ( cfg ) {
        return Object.assign( {
            type: null,
            instance: null,
            order: 1,
            enabled: false,
            title: null,
            icon: 'widgets',
            showTitle: false,
        }, cfg )
    }
} )
