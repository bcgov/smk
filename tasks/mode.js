module.exports = function( grunt ) {

    grunt.registerTask( 'mode', 'build mode', function ( mode ) {
        grunt.loadTasks( 'tasks/mode-' + mode )
        
        if ( grunt.config( 'mode' ) != mode )
            grunt.fail.fatal( 'Build mode ' + mode + ' not found' )
    } )

    grunt.log.ok( 'Task mode' )
}