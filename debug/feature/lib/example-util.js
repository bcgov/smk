function dialog( contents ) {
    var el = document.createElement( 'dialog' )
    el.innerHTML = contents.map( function ( c ) {
        return '<p>' + ( '' + c ).replace( /[&]/g, '&amp;' ).replace( /[<]/g, '&lt;' ).replace( /[>]/g, '&gt;' ) + '</p>'
    } ).join( '' )
    el.addEventListener( 'click', function () { this.close() } )
    document.body.appendChild( el )
    el.showModal()
}