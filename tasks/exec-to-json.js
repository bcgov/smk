module.exports = function( grunt ) {

    var child_process = require( 'child_process' )

    grunt.registerTask( 'exec-to-json', function ( fn, configOut ) {
        fn = grunt.template.process( fn )
        grunt.log.write( 'Executing ' + fn + '...' )
        var json = child_process.execSync( 'node ' + fn )
        grunt.verbose.writeln( json )
        var out = JSON.parse( json )
        grunt.log.ok()
        grunt.config.set( configOut, out )
    } )

    grunt.log.ok( 'Task exec-to-json' )
}

