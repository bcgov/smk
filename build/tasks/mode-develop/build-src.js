module.exports = function( grunt ) {

    grunt.registerTask( 'build-lib', [
        'jshint:scripts',
        'copy:scripts',
        'copy:styles',
        'copy:templates',
        'copy:assets',
    ] )

    grunt.config.merge( {

        jshint: {
            'scripts': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ '<%= tagRef.scripts %>', '<%= tagRef.dist_scripts %>', '!**/lib/**', '!**/node_modules/**' ]
            },
        },              

        copy: {
            'scripts': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ '<%= tagRef.scripts %>', '<%= tagRef.dist_scripts %>' ],
                dest: '<%= distPath %>/assets/src'
            },

            'styles': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ '<%= tagRef.styles %>', '<%= tagRef.dist_styles %>' ],
                dest: '<%= distPath %>/assets/src'
            },

            'templates': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: '<%= tagRef.templates %>',
                dest: '<%= distPath %>/assets/src'
            },

            'assets': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: '<%= tagRef.assets %>',
                dest: '<%= distPath %>/assets/src'
            }
        }

    } )

    grunt.log.ok( 'Task mode-develop/build-lib' )
}