module.exports = function( grunt ) {

    grunt.config( 'mode', 'release' )
    grunt.config( 'reload', '' )

    grunt.registerTask( 'build-lib', [
        'jshint:lib',
        'copy:minified-lib',
        'uglify:lib'
    ] )

    grunt.registerTask( 'build-smk', [
        'generate-tags',
        'write-tag-head-foot',
        'concat:smk',
    ] )

    grunt.config.merge( {
        clean: {
            temp: {
                src: [ undefined, '<%= buildPath %>/tags/**', '<%= buildPath %>/smk/**', '<%= buildPath %>/lib/**' ]
            }
        },

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
                        cwd: 'lib',
                        src: 'include.js',
                        dest: '<%= buildPath %>/lib'
                    }
                ]
            }
        },

        concat: {
            smk: {
                options: {
                    banner: '// SMK <%= pom.project.version %>\n',
                    process: function ( content, src ) {
                        if ( /smk.js$/.test( src ) )
                            return grunt.config( 'processTemplate' )( content, src )
                        else
                            return content
                    }
                },
                src: [
                    'lib/include.js',
                    '<%= buildPath %>/smk-tags-head.js',
                    '<%= buildPath %>/tags/*',
                    '<%= buildPath %>/smk-tags-foot.js',
                    '<%= srcPath %>/smk.js'
                ],
                dest: '<%= buildPath %>/smk.js'
            }
        }

    } )

    grunt.log.ok( 'Task release-mode' )
}