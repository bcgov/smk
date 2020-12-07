module.exports = function( grunt ) {

    var child_process = require( 'child_process' )

    grunt.registerMultiTask( 'exec', 'Execute a process and collect stdout', function () {
        var option = this.options( {
        } )

        this.files.forEach( function ( f ) {
            var out = ''
            f.src.forEach( function ( fn ) {
                grunt.log.write( 'Executing ' + f.src + '...' )
                
                var chout = child_process.execSync( 'node ' + fn )
                // grunt.verbose.write( chout )
                out += chout
                
                grunt.log.ok()
            } )
            grunt.file.write( f.dest, out )
        } )
    } )

    grunt.log.ok( 'Task exec' )
}

