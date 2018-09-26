include.module( 'check-directions', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        // var showFeatures 

        // if ( !tool.showFeatures || tool.showFeatures == 'auto' ) {
        //     if ( smk.$device == 'desktop' ) {
        //         showFeatures = 'directions-popup'
        //     }
        //     else {
        //         showFeatures = 'directions-feature'
        //     }
        // }
        // else {
        //     showFeatures = tool.showFeatures
        // }
        
        // tool.showFeatures = showFeatures

        smk.tools.push( {
            type: 'directions-route',
            enabled: true,
            position: tool.position
        } )
    }
    
} )
