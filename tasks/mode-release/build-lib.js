module.exports = function( grunt ) {

    grunt.registerTask( 'build-lib', [
        'jshint:lib',
        'copy:minified-lib',
        'uglify:lib'
    ] )

    grunt.config.merge( {

        copy: {
            'minified-lib': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**/*.min.js' ],
                        dest: '<%= buildPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**/*', '!**/*.js' ],
                        dest: '<%= buildPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*.min.js' ],
                        dest: '<%= buildPath %>/lib'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*', '!**/*.js' ],
                        dest: '<%= buildPath %>/lib'
                    },
                ]
            },
        },

        uglify: {
            lib: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**/*.js', '!**/*.min.js' ],
                        dest: '<%= buildPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*.js', '!**/*.min.js' ],
                        dest: '<%= buildPath %>/lib'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: 'include.js',
                        dest: '<%= buildPath %>/lib'
                    }
                ]
            }
        },

    } )

    grunt.log.ok( 'Task mode-release/build-lib' )
}