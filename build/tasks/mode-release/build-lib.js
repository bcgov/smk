module.exports = function( grunt ) {

    grunt.registerTask( 'build-lib', [
        'jshint:lib',
        'copy:minified-lib',
        'uglify:lib'
    ] )

    grunt.config.merge( {

        jshint: {
            lib: [ 
                '<%= srcPath %>/smk/**/*js', 
                '!<%= srcPath %>/smk/**/lib/**', 
                '!<%= srcPath %>/smk/**/*.min.js' 
            ]
        },

        copy: {
            'minified-lib': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**/*.min.js' ],
                        dest: '<%= tempPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**/*', '!**/*.js' ],
                        dest: '<%= tempPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*.min.js' ],
                        dest: '<%= tempPath %>/lib'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*', '!**/*.js' ],
                        dest: '<%= tempPath %>/lib'
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
                        dest: '<%= tempPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**/*.js', '!**/*.min.js' ],
                        dest: '<%= tempPath %>/lib'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: 'include.js',
                        dest: '<%= tempPath %>/lib'
                    }
                ]
            }
        },

    } )

    grunt.log.ok( 'Task mode-release/build-lib' )
}