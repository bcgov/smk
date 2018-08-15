module.exports = function( grunt ) {

    grunt.config( 'mode', 'dev' )

    grunt.registerTask( 'build-lib', [
        'jshint:lib',
        'copy:lib',
    ] )

    grunt.registerTask( 'build-smk', [
        'generate-tags:true',
        'write-tag-head-foot',
        'concat:smk',
        'jshint:smk',
    ] )

    grunt.config.merge( {
        clean: {
            temp: {
                src: [ undefined, '<%= buildPath %>/tags/**', '<%= buildPath %>/smk-tags.js' ]
            }
        },

        copy: {
            'lib': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/smk',
                        src: [ '**' ],
                        dest: '<%= buildPath %>/smk'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcPath %>/lib',
                        src: [ '**' ],
                        dest: '<%= buildPath %>/lib'
                    },
                ]
            },
        },

        concat: {
            smk: {
                options: {
                    banner: '// SMK\n',
                    process: '<%= processTemplate %>',
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
        },

    } )

    grunt.log.ok( 'Task dev-mode' )
}