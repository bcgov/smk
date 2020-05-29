include.module( 'check-query', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            // id: 'query-results--' + tool.instance,
            id: null,
            type: 'query-results',
            enabled: true,
            parentId: tool.id
        } ) )

        smk.tools.push( Object.assign( {}, tool, {
            id: null,
            type: 'query-feature',
            enabled: true,
            parentId: 'query-results--' + tool.instance
        } ) )
    }
    
} )
