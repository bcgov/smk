include.module( 'libs', [ 'document-ready' ], function () {
    "use strict";

    // include.option( { baseUrl: attr[ 'base-url' ] } )

// return whenDocumentReady()
    // .then( function () {
        if ( window.jQuery ) {
            include.tag( 'jquery' ).include = Promise.resolve( window.jQuery )
            return
        }

    //     return include( 'jquery' )
    // } )
    // .then( function () {
        if ( window.Vue ) {
            include.tag( 'vue' ).include = Promise.resolve( window.Vue )
            return
        }

    //     return include( 'vue' )
    // } )
    // .then( function () {
    //     return include( 'vue-config' )
    // } )
    // .then( function () {
        if ( window.turf ) {
            include.tag( 'turf' ).include = Promise.resolve( window.turf )
            return
        }

    //     return include( 'turf' )
    // } )
    // .then( function () {
    //     return include( 'smk-map' ).then( function ( inc ) {
    //         if ( attr[ 'id' ] in SMK.MAP )
    //             throw new Error( 'An SMK map with smk-id "' + attr[ 'id' ] + '" already exists' )

    //         var map = SMK.MAP[ attr[ 'id' ] ] = new SMK.TYPE.SmkMap( attr )
    //         return map.initialize()
    //     } )
} )
