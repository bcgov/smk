include.module( 'merge-config', [ 'util' ], function () {
    "use strict";

    var pathMatchers = []

    function addPathMatchStrategy( pathPattern, handler ) {
        pathMatchers.push( {
            regex: new RegExp( '^' + pathPattern + '$' ),
            path: pathPattern,
            strategy: handler
        } )
    }

    addPathMatchStrategy( '',                                           objectMerge )
    addPathMatchStrategy( '/name',                                      valueMerge )
    addPathMatchStrategy( '/viewer',                                    objectMerge )
    addPathMatchStrategy( '/viewer/location',                           assignMerge )
    addPathMatchStrategy( '/layers',                                    arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/layers<.+?>/id',                            ignoreMerge )
    addPathMatchStrategy( '/layers<.+?>/attributes',                    assignMerge )
    addPathMatchStrategy( '/layers<.+?>/queries',                       arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/layers<.+?>/queries<.+?>/parameters',       arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/tools',                                     toolMerge )
    addPathMatchStrategy( '/tools<.+?>/type',                           ignoreMerge )
    addPathMatchStrategy( '/tools<.+?>/instance',                       ignoreMerge )
    addPathMatchStrategy( '/tools<.+?>/position',                       assignMerge )
    addPathMatchStrategy( '/tools<layers,.+?>/display',                 arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/tools<layers,.+?>/display<.+?>(/items<.+?>)*/items',   arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/tools<.+?>/internalLayers',                 arrayOfObjectMerge( 'id' ) )
    addPathMatchStrategy( '/tools<.+?>/internalLayers<.+?>/style',      assignMerge )

    function getPathStrategy( path ) {
        for ( var i = 0; i < pathMatchers.length; i += 1 ) {
            var pm = pathMatchers[ i ]

            if ( !pm.regex.test( path ) ) continue

            if ( path != pm.path )
                console.debug( JSON.stringify( path ), '~', JSON.stringify( pm.path ) )

            return pm.strategy
        }
    }

    var typeStrategy = {
        object: objectMerge,
        array: arrayMerge,
        boolean: valueMerge,
        number: valueMerge,
        string: valueMerge,
    }

    function deref( objectIndex ) {
        var o = objectIndex[ 0 ], i = objectIndex[ 1 ]
        if ( i == null ) return o
        return o[ i ]
    }

    function merge( base, source, path ) {
        var strategy = getPathStrategy( path )
        if ( strategy ) {
            return strategy( base, source, path )
        }

        var btype = SMK.UTIL.type( deref( base ) )
        strategy = typeStrategy[ btype ]
        if ( strategy ) {
            return strategy( base, source, path )
        }

        var stype = SMK.UTIL.type( deref( source ) )
        strategy = typeStrategy[ stype ]
        if ( strategy ) {
            return strategy( base, source, path )
        }

        if ( stype == 'null' || stype == 'undefined' ) {
            return
        }

        console.warn( path, 'no merge strategy', base, source )
        throw Error( 'no merge strategy for "' + path + '"' )
    }

    function ignoreMerge( base, source, path ) {
        console.debug( path, 'ignored' )
    }

    function assignMerge( base, source, path ) {
        var b = deref( base ),
            s = deref( source )

        if ( !b ) {
            base[0][ base[1] ] = s
            console.log( path, '=', JSON.parse( JSON.stringify( s ) ) )
            return
        }

        if ( s === null ) {
            delete base[0][ base[1] ]
            console.log( path, 'deleted' )
            return
        }

        base[0][ base[1] ] = s
        console.log( path, '=', JSON.parse( JSON.stringify( s ) ) )
    }

    function assertObject( v, ctx, path  ) {
        if ( SMK.UTIL.type( v ) != 'object' ) throw Error( 'Expected an Object in ' + ctx + ' at ' + path )
    }

    function assertArray( v, ctx, path ) {
        if ( SMK.UTIL.type( v ) != 'array' ) throw Error( 'Expected an Array in ' + ctx + ' at ' + path )
    }

    function assertValue( v, ctx, path  ) {
        var t = SMK.UTIL.type( v )
        if ( t != 'number' && t != 'string' && t != 'boolean' ) throw Error( 'Expected a Value in ' + ctx + ' at ' + path )
    }

    function valueMerge( base, source, path ) {
        var b = deref( base ),
            s = deref( source )

        if ( !b ) {
            base[0][ base[1] ] = s
            console.log( path, '=', JSON.parse( JSON.stringify( s ) ) )
            return
        }

        if ( s === null ) {
            delete base[0][ base[1] ]
            console.log( path, 'deleted' )
            return
        }

        assertValue( s, 'source', path )
        base[0][ base[1] ] = s
        console.log( path, '=', JSON.parse( JSON.stringify( s ) ) )
    }

    function objectMerge( base, source, path ) {
        var b = deref( base ),
            s = deref( source )

        if ( !b ) {
            base[0][ base[1] ] = s
            console.log( path, '=', s )
            return
        }

        if ( s === null ) {
            delete base[0][ base[1] ]
            console.log( path, 'deleted' )
            return
        }

        assertObject( b, 'base', path )
        assertObject( s, 'source', path )

        Object.keys( s ).forEach( function ( k ) {
            merge( [ b, k ], [ s, k ], path + '/' + k )
        } )
    }

    function arrayMerge( base, source, path ) {
        var b = deref( base ),
            s = deref( source )

        if ( !b ) {
            base[0][ base[1] ] = s
            console.log( path, '=', s )
            return
        }

        if ( s === null ) {
            delete base[0][ base[1] ]
            console.log( path, 'deleted' )
            return
        }

        assertArray( b, 'base', path )
        assertArray( s, 'source', path )

        base[0][ base[1] ] = b.concat( s )
        console.log( path, 'concat', s )
    }

    function arrayOfObjectMerge( key ) {
        return function ( base, source, path ) {
            var b = deref( base ),
                s = deref( source )

            if ( !b ) {
                base[0][ base[1] ] = s
                console.log( path, '=', JSON.parse( JSON.stringify( s ) ) )
                return
            }

            if ( s === null ) {
                delete base[0][ base[1] ]
                console.log( path, 'deleted' )
                return
            }

            assertArray( b, 'base', path )
            assertArray( s, 'source', path )

            s.forEach( function ( so, si ) {
                assertObject( so, 'source', path + '[' + si + ']' )

                var id = new RegExp( '^' + ( so[ key ] == '*' ? '.*' : so[ key ] ) + '$' )

                var bis = b.map( function ( bo, bi ) {
                    if ( id.test( bo[ key ] ) )
                        return bi
                } ).filter( function ( i ) {
                    return i != null
                } )

                if ( bis.length > 0 ) {
                    bis.forEach( function ( bi ) {
                        merge( [ b, bi ], [ s, si ], path + '<' + b[ bi ][ key ] + '>' )
                    } )
                }
                else {
                    b.push( so )
                    console.log( path, 'concat', so )
                }
            } )
        }
    }

    function toolMerge( base, source, path ) {
        var b = deref( base ),
            s = deref( source )

        assertArray( b, 'base', path )
        assertArray( s, 'source', path )

        s.forEach( function ( so, si ) {
            if ( !so.instance ) {
                arrayOfObjectMerge( 'type' )( base, [ [ [ so ] ], 0 ], path )
                return
            }

            if ( so.type == '*' ) {
                console.warn( 'tool type is *, but instance not null, skipping', so )
                return
            }

            var inst = b.find( function ( bo ) {
                return bo.type == so.type && bo.instance == so.instance
            } )

            if ( !inst ) {
                var baseInst = b.find( function ( bo ) {
                    return bo.type == so.type && bo.instance === true
                } )

                if ( baseInst ) {
                    inst = JSON.parse( JSON.stringify( baseInst ) )
                    inst.instance = so.instance
                    console.log( 'copied base instance', JSON.parse( JSON.stringify( inst ) ) )
                }
                else {
                    inst = {
                        type: so.type,
                        instance: so.instance
                    }
                    console.log( 'created base instance', JSON.parse( JSON.stringify( inst ) ) )
                }

                b.push( inst )
            }

            merge( [ [ inst ], 0 ], [ [ so ], 0 ], path + '<' + so.type + ',' + so.instance + '>' )
        } )
    }

    return function mergeConfigs ( configs ) {
        var base = JSON.parse( JSON.stringify( SMK.CONFIG ) )
        var inline = 0

        while( configs.length > 0 ) {
            var source = configs.shift()

            var $s = 'config ' + JSON.stringify( source.$source || 'inline #' + (inline += 1, inline) )
            delete source.$source
            console.groupCollapsed( $s )

            console.debug( 'merging:', JSON.parse( JSON.stringify( { base: base, source: source } ) ) )
            merge( [ { '$': base }, '$' ], [ { '$': source }, '$' ], '' )

            console.groupEnd( $s )
        }
        console.log( 'merged config', JSON.parse( JSON.stringify( base ) ) )

        return base
    }

    // function mergeViewer( base, merge ) {
    //     if ( !merge.viewer ) return

    //     if ( base.viewer ) {
    //         if ( base.viewer.location && merge.viewer.location ) {
    //             Object.assign( base.viewer.location, merge.viewer.location )
    //             delete merge.viewer.location
    //         }

    //         Object.assign( base.viewer, merge.viewer )
    //     }
    //     else {
    //         base.viewer = merge.viewer
    //     }

    //     delete merge.viewer
    // }


    // function mergeTools( base, merge ) {
    //     return mergeCollection( base, merge, 'tools', {
    //         findFn: function ( merge ) {
    //             return function ( base ) {
    //                 return ( merge.type == base.type || merge.type == '*' ) &&
    //                     ( !merge.instance || merge.instance == base.instance )
    //             }
    //         },
    //         mergeFn: function ( base, merge ) {
    //             if ( merge.type && merge.type == '*' ) {
    //                 var m = JSON.parse( JSON.stringify( merge ) )
    //                 delete m.type
    //                 Object.assign( base, m )
    //             }
    //             else if ( merge.type === 'layers' ) {
    //                 mergeLayerDisplays( base, merge )
    //                 Object.assign( base, merge )
    //             }
    //             else {
    //                 Object.assign( base, merge )
    //             }
    //         }
    //     } )
    // }

    // function mergeLayerDisplays( base, merge ) {
    //     return mergeCollection( base, merge, 'display', {
    //         findFn: function ( merge ) {
    //             return function ( base ) {
    //                 return merge.id == base.id
    //             }
    //         },
    //         mergeFn: function ( base, merge ) {
    //             mergeLayerDisplays( base, merge )

    //             Object.assign( base, merge )
    //         }
    //     } )
    // }

    // function mergeLayers( base, merge ) {
    //     return mergeCollection( base, merge, 'layers', {
    //         findFn: function ( merge ) {
    //             return function ( base ) {
    //                 return merge.id == base.id || merge.id.startsWith( '*' )
    //             }
    //         },
    //         mergeFn: function ( baseLayer, mergeLayer ) {
    //             mergeCollection( baseLayer, mergeLayer, 'queries', {
    //                 mergeFn: function ( baseQuery, mergeQuery ) {
    //                     mergeCollection( baseQuery, mergeQuery, 'parameters', {} )

    //                     Object.assign( baseQuery, mergeQuery )
    //                 }
    //             } )

    //             if ( mergeLayer.id == '**' && !mergeLayer.layers )
    //                 mergeLayer.layers = [ JSON.parse( JSON.stringify( mergeLayer ) ) ]

    //             mergeLayers( baseLayer, mergeLayer )

    //             if ( mergeLayer.id && mergeLayer.id.startsWith( '*' ) ) {
    //                 var m = JSON.parse( JSON.stringify( mergeLayer ) )
    //                 delete m.id
    //                 Object.assign( baseLayer, m )
    //             }
    //             else {
    //                 Object.assign( baseLayer, mergeLayer )
    //             }
    //         }
    //     } )
    // }

    // function mergeCollection( base, merge, prop, arg ) {
    //     var findFn = arg[ 'findFn' ] || function ( merge ) {
    //         return function ( base ) {
    //             return merge.id == base.id
    //         }
    //     }

    //     var mergeFn = arg[ 'mergeFn' ] || function ( base, merge ) {
    //         Object.assign( base, merge )
    //     }

    //     if ( !merge[ prop ] ) return

    //     if ( base[ prop ] ) {
    //         merge[ prop ].forEach( function( m ) {
    //             var items = base[ prop ].filter( findFn( m ) )
    //             if ( items.length > 0 ) {
    //                 items.forEach( function ( item ) {
    //                     mergeFn( item, m )
    //                 } )
    //             }
    //             else {
    //                 base[ prop ].push( m )
    //             }
    //         } )
    //     }
    //     else {
    //         base[ prop ] = merge[ prop ]
    //     }

    //     delete merge[ prop ]
    // }

} )
