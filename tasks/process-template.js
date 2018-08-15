module.exports = function( grunt ) {
    grunt.config.merge( {

        processTemplate: function ( content, srcpath ) {
            return content.replace( /\<\%\=\s*[^%]+\s*\%\>/gi, function (m) {
                grunt.verbose.writeln( srcpath + ': ' + m );
                return grunt.template.process( m );
            } )
        }

    } )

    grunt.log.ok( 'Task process-template' )
}