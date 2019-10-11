include.module( 'check-query-place', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'query-results',
            instance: 'place',
            enabled: true,
            position: tool.position
        } )

        smk.tools.push( {
            type: 'query-feature',
            instance: 'place',
            enabled: true,
            position: tool.position
        } )
    }
    
} )
