module.exports = function( grunt ) {

    grunt.registerTask( 'build-images', [
        'copy:images',
    ] )

    grunt.config.merge( {

        copy: {
            'images': {
                expand: true,
                cwd: '<%= srcPath %>/smk',
                src: [ '**/*.{gif,png,jpg,jpeg,svg}' ],
                dest: '<%= distPath %>/images'
            }
        }

    } )

    grunt.log.ok( 'Task build-images' )
}