include.module( 'check-identify', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            id: null,
            type: 'identify-feature',
            enabled: true,
        } ) )
    }
    
} )
