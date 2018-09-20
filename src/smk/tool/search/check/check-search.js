include.module( 'check-search', [], function ( inc ) {
    "use strict";

    return function ( smk, tool ) {
        var showFeatures

        if ( smk.$device == 'desktop' ) {
            showFeatures = 'search-popup'
        }
        else {
            showFeatures = 'search-location'
        }
        
        tool.showFeatures = showFeatures

        smk.tools.push( {
            type: showFeatures,
            enabled: true,
            position: tool.position
        } )
    }
    
} )
