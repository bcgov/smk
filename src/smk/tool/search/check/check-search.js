include.module( 'check-search', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'search-location',
            enabled: true,
            position: tool.position
        } )
    }
    
} )
