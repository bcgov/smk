module.exports = function( grunt ) {

    grunt.registerTask( 'build-smk', [
        'copy:tags',
        'exec-to-json:<%= buildPath %>/smk-tags.js:tags',
        'generate-tags:tags',
        'concat:tags',
        'concat:smk',
    ] )

    grunt.config.merge( {

        copy: {
            'tags': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ 'smk-tags.js' ],
                dest: '<%= buildPath %>',
                options: {
                    process: '<%= processTemplate %>',
                },
            },

        },

        concat: {
           tags: {
                options: {
                    banner: '( function ( skip ) {\n"use strict";\nif ( skip ) return;\n\n',
                    footer: '\nwindow.include.SMK = true\n} )( window.include.SMK );\n'
                    // process: '<%= processTemplate %>',
                },
                src: '<%= buildPath %>/tags/*',
                dest: '<%= buildPath %>/tags.js'
            },

            smk: {
                options: {
                    banner: '// SMK v<%= package.version %>\n',
                    process: function ( content, src ) {
                        if ( /smk.js$/.test( src ) )
                            return grunt.config( 'processTemplate' )( content, src )
                        else
                            return content
                    }
                },
                src: [
                    '<%= srcPath %>/lib/include.js',
                    '<%= buildPath %>/tags.js',
                    '<%= srcPath %>/smk.js'
                ],
                dest: '<%= distPath %>/smk.js'
            }
        }

    } )

    grunt.log.ok( 'Task mode-release/build-smk' )
}