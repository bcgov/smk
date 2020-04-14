include.module( 'check-search', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        if ( tool.showPanel === false ) return

        if ( smk.tools.some( function ( t ) { return t.type == 'search-location' } ) ) return

        smk.tools.push( Object.assign( {}, tool, {
            id: null,
            type: 'search-location',
        } ) )
    }   
} )
