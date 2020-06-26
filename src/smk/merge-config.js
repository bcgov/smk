include.module( 'merge-config', [], function () {
    "use strict";

    return function mergeConfigs ( configs ) {
        var config = Object.assign( {}, SMK.CONFIG )

        console.log( 'base', JSON.parse( JSON.stringify( config ) ) )

        while( configs.length > 0 ) {
            var c = configs.shift()

            console.log( 'merging', JSON.parse( JSON.stringify( c ) ) )

            mergeViewer( config, c )
            mergeTools( config, c )
            mergeLayers( config, c )

            Object.assign( config, c )

            console.log( 'merged', JSON.parse( JSON.stringify( config ) ) )
        }

        return config
    }
    
    function mergeViewer( base, merge ) {
        if ( !merge.viewer ) return

        if ( base.viewer ) {
            if ( base.viewer.location && merge.viewer.location ) {                        
                Object.assign( base.viewer.location, merge.viewer.location )
                delete merge.viewer.location
            }

            Object.assign( base.viewer, merge.viewer )
        }
        else {
            base.viewer = merge.viewer
        }

        delete merge.viewer
    }


    function mergeTools( base, merge ) {
        return mergeCollection( base, merge, 'tools', {
            findFn: function ( merge ) {
                return function ( base ) {
                    return ( merge.type == base.type || merge.type == '*' ) &&
                        ( !merge.instance || merge.instance == base.instance )
                }
            },
            mergeFn: function ( base, merge ) {
                if ( merge.type && merge.type == '*' ) {
                    var m = JSON.parse( JSON.stringify( merge ) )
                    delete m.type
                    Object.assign( base, m )
                }
                else if ( merge.type === 'layers' ) {
                    mergeLayerDisplays( base, merge )
                    Object.assign( base, merge )
                }
                else {
                    Object.assign( base, merge )
                }
            }
        } )
    }

    function mergeLayerDisplays( base, merge ) {
        return mergeCollection( base, merge, 'display', {
            findFn: function ( merge ) {
                return function ( base ) {
                    return merge.id == base.id
                }
            },
            mergeFn: function ( base, merge ) {
                mergeLayerDisplays( base, merge )

                Object.assign( base, merge )
            }
        } )
    }

    function mergeLayers( base, merge ) {
        return mergeCollection( base, merge, 'layers', {
            findFn: function ( merge ) {
                return function ( base ) {
                    return merge.id == base.id || merge.id.startsWith( '*' )
                }
            },
            mergeFn: function ( baseLayer, mergeLayer ) {
                mergeCollection( baseLayer, mergeLayer, 'queries', {
                    mergeFn: function ( baseQuery, mergeQuery ) {
                        mergeCollection( baseQuery, mergeQuery, 'parameters', {} )

                        Object.assign( baseQuery, mergeQuery )
                    }
                } )

                if ( mergeLayer.id == '**' && !mergeLayer.layers )
                    mergeLayer.layers = [ JSON.parse( JSON.stringify( mergeLayer ) ) ]

                mergeLayers( baseLayer, mergeLayer )

                if ( mergeLayer.id && mergeLayer.id.startsWith( '*' ) ) {
                    var m = JSON.parse( JSON.stringify( mergeLayer ) )
                    delete m.id
                    Object.assign( baseLayer, m )
                }
                else {
                    Object.assign( baseLayer, mergeLayer )
                }
            }
        } )
    }

    function mergeCollection( base, merge, prop, arg ) {
        var findFn = arg[ 'findFn' ] || function ( merge ) {
            return function ( base ) {
                return merge.id == base.id
            }
        }

        var mergeFn = arg[ 'mergeFn' ] || function ( base, merge ) {
            Object.assign( base, merge )
        }

        if ( !merge[ prop ] ) return

        if ( base[ prop ] ) {
            merge[ prop ].forEach( function( m ) {
                var items = base[ prop ].filter( findFn( m ) )
                if ( items.length > 0 ) {
                    items.forEach( function ( item ) {
                        mergeFn( item, m )
                    } )
                }
                else {
                    base[ prop ].push( m )
                }
            } )
        }
        else {
            base[ prop ] = merge[ prop ]
        }

        delete merge[ prop ]
    }

} )
