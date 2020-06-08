include.module( 'projections', [ 'proj4' ], function () {
    "use strict";

    SMK.PROJECTIONS.forEach( function ( pr ) {
        if ( !pr.name ) return

        if ( pr.def ) {
            proj4.defs( pr.name, pr.def )            
        }        
        else if ( pr.alias ) {
            var def = proj4.defs( pr.alias )
            if ( !def ) return

            proj4.defs( pr.name, def )            
        }
    } )
} )