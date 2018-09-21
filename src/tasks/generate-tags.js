module.exports = function( grunt ) {

    var path = require('path')
    var child_process = require( 'child_process' )

    grunt.registerTask( 'generate-tags', function ( dev ) {
        grunt.log.write( 'Generating tags...' )
        var json = child_process.execSync( 'node tags.js' )
        grunt.verbose.writeln( json )
        var tag = JSON.parse( json )
        grunt.log.ok()

        var tags = Object.keys( tag ).sort()

        var outPath = path.join( grunt.config( 'buildPath' ), 'tags' )
        grunt.file.mkdir( outPath )

        grunt.log.write( 'Writing ' + tags.length + ' tag files to ' + outPath + '...' )
        tags.forEach( function ( t ) {
            var inc = tag[ t ]
            var fn = path.join( outPath, t + '.js' )

            var out
            if ( dev )
                out = JSON.stringify( inc, null, '    ' ).trim().split( '\n' )
            else 
                out = load( t, inc, grunt.config( 'buildPath' ) )

            grunt.file.write( fn, [ 'include.tag( "' + t + '",' ].concat( out.map( function ( v ) { return '    ' + v } ) ).concat( ')\n' ).join( grunt.util.linefeed ) )
            grunt.verbose.writeln( 'wrote ' + fn )
        } )
        grunt.log.ok()
    } )

    function load( tag, inc, basePath ) {
        if ( typeof inc == 'string' ) return [ '"' + inc + '"' ]

        var def = loader[ inc.loader ]( tag, inc, basePath )

        return def
    }

    var loader = {
        script: function ( tag, inc, basePath ) {
            if ( inc.external ) return [ JSON.stringify( inc ) ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [
                '{ loader: "script", url: "' + inc.url + '", load: function () {',
                '    console.log( "[' + inc.url + ']" );',
                '    ' + f,
                '} }'
            ]
        },

        style: function ( tag, inc, basePath ) {
            if ( inc.external ) return [ JSON.stringify( inc ) ]

            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [
                '{ loader: "style", url: "' + inc.url + '", load: ' + JSON.stringify( '/* [' + inc.url + '] */\n' + f.toString() ) + ' }'
            ]
        },

        template: function ( tag, inc, basePath ) {
            var f = grunt.file.read( path.join( basePath, inc.url ) )

            return [
                '{ loader: "template", url: "' + inc.url + '", load:' + JSON.stringify( f.toString() ) + ' }'
            ]
        },

        group: function ( tag, inc, basePath ) {
            var g = inc.tags
                .map( function ( i ) { return load( null, i, basePath ) } )
                .reduce( function( a, v ) { a[ a.length - 1 ] += ','; return a.concat( v ) }, [] )
                .map( function ( v ) { return '    ' + v } )

            g.unshift( '{ loader: "group", tags: [' )
            g.push(    '] }' )
            return g
        },

        sequence: function ( tag, inc, basePath ) {
            var g = inc.tags
                .map( function ( i ) { return load( null, i, basePath ) } )
                .reduce( function( a, v ) { a[ a.length - 1 ] += ','; return a.concat( v ) }, [] )
                .map( function ( v ) { return '    ' + v } )

            g.unshift( '{ loader: "sequence", tags: [' )
            g.push(    '] }' )
            return g
        }
    }

    grunt.log.ok( 'Task generate-tags' )
}