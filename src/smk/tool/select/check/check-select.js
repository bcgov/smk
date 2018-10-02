include.module( 'check-select', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'select-feature',
            enabled: true,
            position: tool.position,
            title: tool.title
        } )
    }
    
} )
