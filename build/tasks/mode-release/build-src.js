module.exports = function( grunt ) {

    grunt.registerTask( 'build-src', [
        'jshint:scripts',
        'copy:scripts',
        'copy:styles',
        'copy:templates',
        'copy:assets',
        'uglify:scripts',
        'cssmin:styles'
    ] )

    grunt.config.merge( {

        jshint: {
            scripts: {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ '<%= tagRef.scripts %>', '<%= tagRef.dist_scripts %>', '!**/lib/**', '!**/node_modules/**' ]
            }
        },

        copy: {
            'scripts': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>',
                        src: '<%= tagRef.scripts %>',
                        dest: '<%= tempPath %>/assets/src'        
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>',
                        src: '<%= tagRef.dist_scripts %>',
                        dest: '<%= distPath %>/assets/src'        
                    },
                ]
            },

            'styles': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: '<%= tagRef.dist_styles %>',
                dest: '<%= distPath %>/assets/src'        
            },
            
            'templates': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: '<%= tagRef.templates %>',
                dest: '<%= tempPath %>/assets/src'
            },

            'assets': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: '<%= tagRef.assets %>',
                dest: '<%= distPath %>/assets/src'
            }
        },

        uglify: {
            scripts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>',
                        src: [ '<%= tagRef.scripts %>', '!**/*.min.js', 'smk.js', 'lib/include.js' ],
                        dest: '<%= tempPath %>/assets/src'
                    }
                ]
            }
        },

        cssmin: {
            styles: {
                files: [ {
                    expand: true,
                    cwd: '<%= srcPath %>',
                    src: '<%= tagRef.styles %>',
                    dest: '<%= tempPath %>/assets/src'
                } ]
            }
        }

    } )

    grunt.log.ok( 'Task mode-release/build-src' )
}