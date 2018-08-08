var path = require('path')

module.exports = function( grunt ) {

    grunt.config( 'mode', 'release' )

    grunt.registerTask( 'build-lib', [
        'jshint:lib',
        'copy:minified-lib',
        'uglify:lib'
    ] )

    grunt.registerTask( 'build-smk', [
        'gen-tags',
        'make-tag-files',
        'write-tag-head-foot',
        'concat:smk',
    ] )

    grunt.registerTask( 'make-tag-files', function () {
        var basePath = grunt.config( 'buildPath' )

        function load( tag, inc ) {
            if ( typeof inc == 'string' ) return [ '"' + inc + '"' ]

            var def = loader[ inc.loader ]( tag, inc )

            if ( tag == null ) return def

            def = def.map( function ( v ) { return '    ' + v } )

            def.unshift( 'include.tag( "' + tag + '", ' )
            def.push(    ');' )

            return def
        }

        var loader = {
            script: function ( tag, inc ) {
                if ( inc.external ) return [ JSON.stringify( inc ) ]

                var f = grunt.file.read( path.join( basePath, inc.url ) )

                return [
                    '{ loader: "script", url: "' + inc.url + '", load: function () {',
                    '    console.log( "[' + inc.url + ']" );',
                    '    ' + f,
                    '} }'
                ]
            },
            style: function ( tag, inc ) {
                if ( inc.external ) return [ JSON.stringify( inc ) ]

                var f = grunt.file.read( path.join( basePath, inc.url ) )

                return [
                    '{ loader: "style", url: "' + inc.url + '", load: ' + JSON.stringify( '/* [' + inc.url + '] */\n' + f.toString() ) + ' }'
                ]
            },
            template: function ( tag, inc ) {
                var f = grunt.file.read( path.join( basePath, inc.url ) )

                return [
                    '{ loader: "template", url: "' + inc.url + '", load:' + JSON.stringify( f.toString() ) + ' }'
                ]
            },
            group: function ( tag, inc ) {
                var g = inc.tags
                    .map( function ( i ) { return load( null, i ) } )
                    .reduce( function( a, v ) { a[ a.length - 1 ] += ','; return a.concat( v ) }, [] )
                    .map( function ( v ) { return '    ' + v } )

                g.unshift( '{ loader: "group", tags: [' )
                g.push(    '] }' )
                return g
            },
            sequence: function ( tag, inc ) {
                var g = inc.tags
                    .map( function ( i ) { return load( null, i ) } )
                    .reduce( function( a, v ) { a[ a.length - 1 ] += ','; return a.concat( v ) }, [] )
                    .map( function ( v ) { return '    ' + v } )

                g.unshift( '{ loader: "sequence", tags: [' )
                g.push(    '] }' )
                return g
            }
        }

        var tag = grunt.config( 'tag' )
        var tags = Object.keys( tag ).sort()

        var outPath = path.join( basePath, 'tags' )
        grunt.file.mkdir( outPath )

        grunt.log.write( 'Writing ' + tags.length + ' tag files to ' + outPath + '...' )
        tags.forEach( function ( t ) {
            var inc = tag[ t ]
            var out = load( t, inc )

            var fn = path.join( outPath, t + '.js' )
            grunt.file.write( fn, out.join( grunt.util.linefeed ) + '\n' )
        } )
        grunt.log.ok()
    } )


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

}