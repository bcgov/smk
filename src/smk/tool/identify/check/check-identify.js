include.module( 'check-identify', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        // var showFeatures 

        // if ( !tool.showFeatures || tool.showFeatures == 'auto' ) {
        //     if ( smk.$device == 'desktop' ) {
        //         showFeatures = 'identify-popup'
        //     }
        //     else {
        //         showFeatures = 'identify-feature'
        //     }
        // }
        // else {
        //     showFeatures = tool.showFeatures
        // }
        
        // tool.showFeatures = showFeatures

        smk.tools.push( {
            type: 'identify-feature',
            enabled: true,
            position: tool.position,
            title: tool.title,
            command: tool.command
        } )
    }
    
} )
