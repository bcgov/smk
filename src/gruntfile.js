module.exports = function( grunt ) {

    var jshintStylish = require( 'jshint-stylish' )

    jshintStylish.reporter = ( function ( inner ) {
        return function ( result, config ) {
            return inner( result, config, { verbose: true } )
        }
    } )( jshintStylish.reporter )


    grunt.initConfig( {
        package: grunt.file.readJSON( '../package.json' ),

        srcPath: '.',

        buildPath: '../build',

        basePath: '..',

        serverHost: 'localhost',

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        copy: {
            'index': {
                expand: true,
                cwd: '<%= srcPath %>',
                src: [ 'index.html' ],
                dest: '<%= buildPath %>',
                options: {
                    process: '<%= processTemplate %>',
                },
            },

            'images': {
                expand: true,
                cwd: '<%= srcPath %>/smk',
                src: [ '**/*.{gif,png,jpg,jpeg}' ],
                dest: '<%= buildPath %>/images'
            },

            'themes': {
                expand: true,
                cwd: '<%= srcPath %>/theme',
                src: [ '**' ],
                dest: '<%= buildPath %>/theme'
            },

            'pom': {
                src: 'pom-template.xml',
                dest: '<%= buildPath %>/pom.xml',
                options: {
                    process: '<%= processTemplate %>',
                },
            },

            'build': {
                expand: true,
                cwd: '<%= buildPath %>',
                src: [ '**' ],
                dest: '<%= basePath %>'
            },

            'deploy': {}
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        clean: {
            options: {
                force: true
            },

            build: {
                src: [ '<%= buildPath %>/**' ]
            },

            base: {
                src: [ '<%= basePath %>/smk.js', '<%= basePath %>/smk', '<%= basePath %>/lib', '<%= basePath %>/index.html', '<%= basePath %>/pom.xml' ]  
            },

            temp: {
                src: [ '<%= buildPath %>/smk-tags-*.js' ]
            }
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        jshint: {
            options: {
                reporter: jshintStylish,
                // reporter: 'checkstyle',

                // unused: true,
                // latedef: true,
                // curly: true,
                // eqeqeq: true,
                bitwise: true,
                strict: true,
                undef: true,
                asi: true,
                plusplus: true,
                eqnull: true,
                multistr: true,
                sub: true,
                browser: true,
                devel: true,

                '-W018': true, // confusing use of !

                globals: {
                    SMK: true,
                    $: true,
                    Vue: true,
                    console: true,
                    Promise: true,
                    include: true,
                    require: true,
                    turf: true,
                    Terraformer: true,
                    proj4: true,
                    L: true,
                },
            },
            lib: [ '<%= srcPath %>/smk/**/*js', '!<%= srcPath %>/smk/**/lib/**', '!<%= srcPath %>/smk/**/*.min.js' ],
            smk: [ '<%= buildPath %>/smk.js' ],
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        watch: {
            options: {
                debounceDelay: 2000,
                livereload: {
                    host:   '<%= serverHost %>',
                    key:    grunt.file.read( '../node_modules/grunt-contrib-connect/tasks/certs/server.key' ),
                    cert:   grunt.file.read( '../node_modules/grunt-contrib-connect/tasks/certs/server.crt' )
                },
                // livereloadOnError: false,
                spawn: false
                // interrupt: true,
            },

            src: {
                files: [ '<%= srcPath %>/smk/**', '<%= srcPath %>/theme/**', '<%= srcPath %>/index.html', '<%= srcPath %>/smk.js', '<%= srcPath %>/tags.js' ],
                tasks: [ 'build' ]
            },

            example: {
                files: [ '../example/**' ]
            }
        }

    } )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    require( 'load-grunt-tasks' )( grunt, { 
        config: '../package.json', 
        requireResolution: true 
    } )

    grunt.loadTasks( 'tasks' )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    grunt.registerTask( 'build', [
        'clean:build',
        'build-info',
        'build-lib',
        'build-images',
        'build-themes',
        'build-smk',
        'build-index',
        'build-pom',
        'clean:temp',
        'clean:base',
        'copy:build',
        'clean:build',
    ] )

    grunt.registerTask( 'write-tag-head-foot', function () {
        var fn = grunt.template.process( '<%= buildPath %>/smk-tags-head.js' )
        grunt.file.write( fn, 'if ( !window.include.SMK ) { ( function () {\n"use strict";\n' )

        var fn = grunt.template.process( '<%= buildPath %>/smk-tags-foot.js' )
        grunt.file.write( fn, '\nwindow.include.SMK = true\n} )() }\n' )
    } )

    grunt.registerTask( 'build-smk', function () {
        grunt.fail.fatal( 'Build mode isn\'t set' )
    } )

    grunt.registerTask( 'build-lib', function () {
        grunt.fail.fatal( 'Build mode isn\'t set' )
    } )

    grunt.registerTask( 'build-images', [
        'copy:images',
    ] )

    grunt.registerTask( 'build-themes', [
        'copy:themes',
    ] )

    grunt.registerTask( 'build-index', [
        'copy:index',
    ] )

    grunt.registerTask( 'build-pom', [
        'copy:pom',
    ] )

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    grunt.registerTask( 'develop', [
        'mode:dev',
        'build',
    ] )

    grunt.registerTask( 'release', [
        'mode:release',
        'build',
    ] )

}