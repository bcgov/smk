include.module( 'check-search', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        if ( smk.tools.some( function ( t ) { 
            return t.type == 'search-location'
        } ) ) return
        
        smk.tools.push( Object.assign( {}, tool, {
            id: 'search-location',
            type: 'search-location',
            enabled: true,
            parentId: tool.id,
        } ) )
    }
    
} )
