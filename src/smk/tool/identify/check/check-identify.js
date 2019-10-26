include.module( 'check-identify', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        smk.tools.push( Object.assign( {}, tool, {
            type: 'identify-feature',
            enabled: true,
            // position: tool.position,
            // title: tool.title,
            // command: tool.command,
            parentId: tool.id,
        } ) )
    }
    
} )
