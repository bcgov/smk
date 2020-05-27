SMK.BOOT
    .then( function ( smk ) {
        dialog( [ 'Map is ready.' ] )
    } )
    .catch( function ( e ) {
        dialog( [ 'Map failed to start.', e ] )
    } )

function dialog( contents ) {
    var el = document.createElement( 'dialog' )
    el.innerHTML = contents.map( function ( c ) { return '<p>' + c + '</p>' } ).join( '' )
    el.addEventListener( 'click', function () { this.close() } )
    document.body.appendChild( el )
    el.showModal()
}