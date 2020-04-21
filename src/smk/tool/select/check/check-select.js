include.module( 'check-select', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            id: null,
            type: 'select-feature',
            enabled: true
        } ) )
    }
    
} )
