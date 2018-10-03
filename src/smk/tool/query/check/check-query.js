include.module( 'check-query', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'query-results',
            instance: tool.instance,
            enabled: true,
            position: tool.position
        } )

        smk.tools.push( {
            type: 'query-feature',
            instance: tool.instance,
            enabled: true,
            position: tool.position
        } )
    }
    
} )
