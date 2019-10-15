include.module( 'check-query', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            type: 'query-results',
            enabled: true,
        } ) )

        smk.tools.push( Object.assign( {}, tool, {
            type: 'query-feature',
            enabled: true,
        } ) )
    }
    
} )
