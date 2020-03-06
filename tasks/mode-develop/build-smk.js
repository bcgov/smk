module.exports = function( grunt ) {

    grunt.registerTask( 'build-smk', [
        'copy:tags',
        'exec-to-json:<%= srcPath %>/smk-tags.js:tags',
        'generate-tags:tags:true',
        'concat:tags',
        'concat:smk',
        'jshint:smk',
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
                    process: '<%= processTemplate %>',
                },
                src: [
                    '<%= srcPath %>/lib/include.js',
                    '<%= buildPath %>/tags.js',
                    '<%= srcPath %>/smk.js'
                ],
                dest: '<%= distPath %>/smk.js'
            }
        },

    } )

    grunt.log.ok( 'Task mode-develop/build-smk' )
}