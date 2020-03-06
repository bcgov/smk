module.exports = function( grunt ) {

    var path = require('path')

    grunt.registerTask( 'generate-tags', function ( tagVar, dev ) {
        var tagDef = grunt.config( tagVar )
        grunt.verbose.writeln( JSON.stringify( tagDef, null, '  ' ) )

        var tags = Object.keys( tagDef ).sort()

        var outPath = path.join( grunt.config( 'buildPath' ), 'tags' )
        grunt.file.mkdir( outPath )

        grunt.log.write( 'Writing ' + tags.length + ' tag files to ' + outPath + '...' )
        tags.forEach( function ( t ) {
            var inc = tagDef[ t ]
            var fn = path.join( outPath, t + '.js' )

            var out = load( t, inc, grunt.config( 'buildPath' ), dev )

            grunt.file.write( fn, outputLines( [ 
                'include.tag( "' + t + '",', 
                out, 
                ');', 
                '' 
            ] ) ) 
        } )
        grunt.log.ok()
    } )

    function load( tag, inc, basePath, dev ) {
        return loader[ inc.loader || 'literal' ]( tag, inc, basePath, dev )
    }

    function outputLines( lines, indent ) {
        return lines.map( function ( ln ) { 
            if ( Array.isArray( ln ) )
                return outputLines( ln, ( indent || '' ) + '    ' )
            else
                return ( indent || '' ) + ln 
        } ).join( grunt.util.linefeed )
    }

    var loader = {
        literal: function ( tag, inc, basePath, dev ) {
            return [ '"' + inc + '"' ]
        },

        script: function ( tag, inc, basePath, dev ) {
            if ( dev || inc.external )
                return [ '{ loader: "script", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "script", url: "' + inc.url + '", load: function () { console.debug( "[' + inc.url + ']" ); ' + f + '} }' ]
        },

        style: function ( tag, inc, basePath, dev ) {
            if ( dev || inc.external )
                return [ '{ loader: "style", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "style", url: "' + inc.url + '", load: ' + JSON.stringify( '/* [' + inc.url + '] */\n' + f.toString() ) + ' }' ]
        },

        template: function ( tag, inc, basePath, dev ) {
            if ( dev )
                return [ '{ loader: "template", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "template", url: "' + inc.url + '", load:' + JSON.stringify( f.toString() ) + ' }' ]
        },

        group: function ( tag, inc, basePath, dev ) {
            return [
                '{ loader: "group", tags: [',
                inc.tags.reduce( function ( acc, i, j ) { 
                    return acc.concat( load( null, i, basePath, dev ) + ( ( j == ( inc.tags.length - 1 ) ) ? '' : ',' ) ) 
                }, [] ),
                '] }'
            ]
        },

        sequence: function ( tag, inc, basePath, dev ) {
            return [
                '{ loader: "sequence", tags: [',
                inc.tags.reduce( function ( acc, i, j ) { 
                    return acc.concat( load( null, i, basePath, dev ) + ( ( j == ( inc.tags.length - 1 ) ) ? '' : ',' ) )
                }, [] ),
                '] }'
            ]
        }
    }

    grunt.log.ok( 'Task generate-tags' )
}