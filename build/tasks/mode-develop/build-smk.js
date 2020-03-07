module.exports = function( grunt ) {

    grunt.registerTask( 'build-smk', [
        'exec:smk-tags',
        'compile-tags:smk',
        'concat:smk',
        'jshint:smk',
    ] )

    grunt.config.merge( {
        'exec': {
            'smk-tags': {
                src: '<%= srcPath %>/smk-tags.js',
                dest: '<%= tempPath %>/smk-tags.json',
            }
        },

        'compile-tags': {
            smk: {
                options: {
                    header: '( function ( skip ) {\n"use strict";\nif ( skip ) return;\n\n',
                    footer: '\nwindow.include.SMK = true\n} )( window.include.SMK );\n'
                },
                src: '<%= tempPath %>/smk-tags.json',
                dest: '<%= tempPath %>/smk-tags.js',
            }
        },

        concat: {
            smk: {
                options: {
                    banner: '// SMK v<%= package.version %>\n',
                    process: '<%= processTemplate %>',
                },
                src: [
                    '<%= srcPath %>/lib/include.js',
                    '<%= tempPath %>/smk-tags.js',
                    '<%= srcPath %>/smk.js'
                ],
                dest: '<%= distPath %>/smk.js'
            }
        },

        jshint: {
            smk: [ '<%= distPath %>/smk.js' ],
        }

    } )

    grunt.log.ok( 'Task mode-develop/build-smk' )
}