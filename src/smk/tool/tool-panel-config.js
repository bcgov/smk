include.module( 'tool-config.tool-panel-config-js', [], function ( inc ) {
    "use strict";

    return function ( cfg ) {
        return Object.assign( {
            showPanel: true,
            showHeader: true,
            showSwipe: false,
            expand: 0,
        }, cfg )
    }
} )
