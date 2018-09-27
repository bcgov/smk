include.module( 'check-directions', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'directions-route',
            enabled: true,
            position: tool.position
        } )
    }
    
} )
