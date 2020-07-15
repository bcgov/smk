include.module( 'libs', [ 'document-ready' ], function () {
    "use strict";

    if ( window.jQuery ) {
        include.tag( 'jquery' ).include = Promise.resolve( window.jQuery )
        return
    }

    if ( window.Vue ) {
        include.tag( 'vue' ).include = Promise.resolve( window.Vue )
        return
    }

    if ( window.turf ) {
        include.tag( 'turf' ).include = Promise.resolve( window.turf )
        return
    }
} )
