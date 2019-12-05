include.module( 'check-directions', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            id: 'directions-route',
            type: 'directions-route',
            enabled: true,
            parentId: tool.id
        } )

        smk.tools.push( Object.assign( {}, tool, {
            id: 'directions-options',
            type: 'directions-options',
            enabled: true,
            parentId: tool.id
        } )
    }
    
} )
