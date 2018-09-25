module.exports = function( grunt ) {

    grunt.registerTask( 'mode', 'build mode', function ( mode ) {
        grunt.loadTasks( 'tasks/' + mode )
        
        if ( !grunt.config( 'mode' ) )
            // grunt.log.ok( 'Loaded build mode ' + grunt.log.wordlist( [ mode ] ) )
        // else
            grunt.fail.fatal( 'Build mode ' + mode + ' not found' )
    } )

    grunt.log.ok( 'Task mode' )
}