module.exports = function( grunt ) {

    var jshintStylish = require( 'jshint-stylish' )

    jshintStylish.reporter = ( function ( inner ) {
        return function ( result, config ) {
            return inner( result, config, { verbose: true } )
        }
    } )( jshintStylish.reporter )

    grunt.initConfig( {
        package: grunt.file.readJSON( 'package.json' ),

        srcPath: 'src',

        tempPath: 'temp',

        distPath: 'dist',

        serverHost: 'localhost',

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        clean: {
            options: {
                force: true
            },

            temp: {
                src: [ '<%= tempPath %>/**' ]
            },

            dist: {
                src: [ '<%= distPath %>/**' ]
            }
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        jshint: {
            options: {
                reporter: jshintStylish,

                // unused: true,
                // latedef: true,
                // curly: true,
                // eqeqeq: true,
                bitwise:    true,
                strict:     true,
                undef:      true,
                asi:        true,
                plusplus:   true,
                eqnull:     true,
                multistr:   true,
                sub:        true,
                browser:    true,
                devel:      true,

                '-W018': true, // confusing use of !

                globals: {
                    SMK:        true,
                    $:          true,
                    Vue:        true,
                    console:    true,
                    Promise:    true,
                    include:    true,
                    require:    true,
                    turf:       true,
                    Terraformer:true,
                    proj4:      true,
                    L:          true,
                },
            },
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        watch: {
            options: {
                debounceDelay:  2000,
                spawn:          false,
            },

            src: {
                files: [
                    '<%= srcPath %>/*.js',
                    '<%= srcPath %>/smk/**',
                    '<%= srcPath %>/theme/**',
                ],
                tasks: [ 'build' ]
            },

            debug: {
                files: [
                    'debug/*/**',
                ]
            }
        },

    } )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    require( 'load-grunt-tasks' )( grunt, {
        config: 'package.json',
        requireResolution: true
    } )

    grunt.loadTasks( 'build/tasks' )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    grunt.registerTask( 'build', [
        'clean:dist',
        'clean:temp',
        'build-info',
        'build-tags',
        'build-src',
        'build-smk',
    ] )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    grunt.registerTask( 'develop', [
        'mode:develop',
        'build',
    ] )

    grunt.registerTask( 'release', [
        'mode:release',
        'build',
    ] )

}