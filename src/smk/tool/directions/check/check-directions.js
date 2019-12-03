include.module( 'check-directions', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( {
            type: 'directions-route',
            enabled: true,
            position: tool.position,
            parentId: tool.id,
            command: tool.command,
            truck: tool.truck
        } )

        smk.tools.push( {
            type: 'directions-options',
            enabled: true,
            position: tool.position,
            parentId: tool.id,
            command: tool.command,
            truck: tool.truck
        } )
    }
    
} )
