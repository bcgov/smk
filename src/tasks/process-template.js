module.exports = function( grunt ) {
    grunt.config.merge( {

        processTemplate: function ( content, srcpath ) {
            var count = 0
            var out = content.replace( /\<\%\=\s*[^%]+\s*\%\>/gi, function (m) {
                grunt.verbose.writeln( srcpath + ': ' + m );
                count += 1
                return grunt.template.process( m );
            } )
            if ( count > 0 )
                grunt.log.ok( count + ' template replacement(s) in ' + srcpath )
            return out
        }

    } )

    grunt.log.ok( 'Task process-template' )
}