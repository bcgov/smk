module.exports = function( grunt ) {

    grunt.registerTask( 'build-themes', [
        'copy:themes',
    ] )

    grunt.config.merge( {

        copy: {
            'themes': {
                expand: true,
                cwd: '<%= srcPath %>/theme',
                src: [ '**' ],
                dest: '<%= tempPath %>/theme'
            },
        },

    } )

    grunt.log.ok( 'Task mode-release/build-themes' )
}