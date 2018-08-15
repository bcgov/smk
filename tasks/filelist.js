module.exports = function( grunt ) {

    var path = require( "path" )

    grunt.registerMultiTask( 'filelist', 'Writes JSON blobs containing names of the matched files to sub-keys for destination in a config setting', function ( setting ) {
        var out = {};
        this.files.forEach( function ( f ) {
            var cwd = f.cwd || '';

            var dest = path.basename( f.dest, path.extname( f.dest ) )

            var list = f.src.map( function ( filename ) {
                var s = path.join( cwd, filename )
                if ( !grunt.file.isFile( s ) ) return;

                grunt.log.writeln( dest + ': ' + filename )
                return {
                    // name: path.basename( s ),
                    path: filename,
                }
            } ).filter( function ( e ) { return !!e } )

            out[ dest ] = list
        } )

        if ( setting )
            grunt.config( setting, jsonOut( out ) )

        function jsonOut( obj ) {
            return JSON.stringify( obj )
        }
    } )

}