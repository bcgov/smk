module.exports = function( grunt ) {

    grunt.registerMultiTask( 'filter-tags', 'Extract urls from tags', function () {
        var option = this.options( {
            result: null
        } )

        this.files.forEach( function ( f ) {
            var out = []
            var bucket = {
                scripts: [],
                dist_scripts: [],
                external_scripts: [],
                styles: [],
                dist_styles: [],
                external_styles: [],
                templates: [],
                assets: []
            }
            f.src.forEach( function ( fn ) {
                tagDef = grunt.file.readJSON( fn )
                // grunt.verbose.write( JSON.stringify( tagDef, null, '  ' ) )

                var tags = Object.keys( tagDef ).sort()
                grunt.log.write( 'Read ' + tags.length + ' tags from ' + f.src + '...' )

                tags.forEach( function ( t ) {
                    getAllUrls( tagDef[ t ], bucket )
                } )
                
                grunt.log.ok()
            } )

            grunt.verbose.write( JSON.stringify( bucket, null, '  ' ) )
            grunt.log.writeln( Object.keys( bucket ).map( function ( b ) { return b + ': ' + bucket[ b ].length } ).join( ', ' ) )

            if ( option.result ) {
                grunt.config( option.result, bucket )
                // grunt.verbose.write( JSON.stringify( grunt.config( option.result ), null, '  ' ) )
            }
        } )
    } )

    function getAllUrls( def, bucket ) {
        if ( def.url && def.loader ) {
            var ldr = def.loader + 's'
            if ( def.external ) 
                ldr = 'external_' + ldr
            else if ( def.inline === false )
                ldr = 'dist_' + ldr

            if ( !bucket[ ldr ] ) bucket[ ldr ] = []
            bucket[ ldr ].push( def.url )
            return 
        }
            
        if ( def.tags )
            return def.tags.forEach( function ( t ) {
                getAllUrls( t, bucket )
            } )
    }

    grunt.log.ok( 'Task filter-tags' )
}