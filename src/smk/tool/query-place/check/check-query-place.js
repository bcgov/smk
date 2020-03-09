include.module( 'check-query-place', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            id: 'query-results--place',
            type: 'query-results',
            instance: 'place',
            enabled: true,
            parentId: tool.id
        } ) )

        smk.tools.push( Object.assign( {}, tool, {
            id: 'query-feature--place',
            type: 'query-feature',
            instance: 'place',
            enabled: true,
            parentId: 'query-results--place'
        } ) )
    }
    
} )
