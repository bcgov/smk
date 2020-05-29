function dialog( contents ) {
    var el = document.createElement( 'dialog' )
    el.innerHTML = contents.map( function ( c ) { return '<p>' + c + '</p>' } ).join( '' )
    el.addEventListener( 'click', function () { this.close() } )
    document.body.appendChild( el )
    el.showModal()
}