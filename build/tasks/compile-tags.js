module.exports = function( grunt ) {

    var path = require('path')

    grunt.registerMultiTask( 'compile-tags', 'Compile include tags description', function () {
        var option = this.options( {
            header: '',
            footer: '',
            inlineLoad: false  
        } )

        this.files.forEach( function ( f ) {
            var out = []
            f.src.forEach( function ( fn ) {
                tagDef = grunt.file.readJSON( fn )
                grunt.verbose.write( JSON.stringify( tagDef, null, '  ' ) )

                var tags = Object.keys( tagDef ).sort()
                grunt.log.write( 'Output ' + tags.length + ' tags from ' + f.src + '...' )

                tags.forEach( function ( t ) {
                    out.push( [
                        'include.tag( "' + t + '",', 
                        load( t, tagDef[ t ], option.basePath, option.inlineLoad ),
                        ');', 
                    ] )
                } )
                grunt.log.ok()
            } )
            grunt.file.write( f.dest, option.header + outputLines( out ) + option.footer )
        } )
    } )

    function load( tag, inc, basePath, inline ) {
        return loader[ inc.loader || 'literal' ]( tag, inc, basePath, inline )
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
        literal: function ( tag, inc, basePath, inline ) {
            return [ '"' + inc + '"' ]
        },

        script: function ( tag, inc, basePath, inline ) {
            if ( !inline || inc.external )
                return [ '{ loader: "script", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "script", url: "' + inc.url + '", load: function () { console.debug( "[' + inc.url + ']" ); ' + f + '} }' ]
        },

        style: function ( tag, inc, basePath, inline ) {
            if ( !inline || inc.external )
                return [ '{ loader: "style", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "style", url: "' + inc.url + '", load: ' + JSON.stringify( '/* [' + inc.url + '] */\n' + f.toString() ) + ' }' ]
        },

        template: function ( tag, inc, basePath, inline ) {
            if ( !inline )
                return [ '{ loader: "template", url: "' + inc.url + '" }' ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [ '{ loader: "template", url: "' + inc.url + '", load:' + JSON.stringify( f.toString() ) + ' }' ]
        },

        group: function ( tag, inc, basePath, inline ) {
            return [
                '{ loader: "group", tags: [',
                inc.tags.reduce( function ( acc, i, j ) { 
                    return acc.concat( load( null, i, basePath, inline ) + ( ( j == ( inc.tags.length - 1 ) ) ? '' : ',' ) ) 
                }, [] ),
                '] }'
            ]
        },

        sequence: function ( tag, inc, basePath, inline ) {
            return [
                '{ loader: "sequence", tags: [',
                inc.tags.reduce( function ( acc, i, j ) { 
                    return acc.concat( load( null, i, basePath, inline ) + ( ( j == ( inc.tags.length - 1 ) ) ? '' : ',' ) )
                }, [] ),
                '] }'
            ]
        }
    }

    grunt.log.ok( 'Task compile-tags' )
}