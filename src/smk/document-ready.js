include.module( 'document-ready', [], function () {
    "use strict";

    return new Promise( function ( res, rej ) {
        if ( document.readyState != "loading" )
            return res()

        document.addEventListener( "DOMContentLoaded", function( ev ) {
            clearTimeout( id )
            res()
        } )

        var id = setTimeout( function () {
            var e = new Error( 'timeout waiting for document ready' )
            console.error( e )
            rej( e )
        }, 20000 )
    } )
} )
