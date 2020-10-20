include.module( 'query.query-vector-js', [ 'query.query-js' ], function () {
    "use strict";
    /* jshint -W014 */ // Misleading line break before '?'

    function VectorQuery() {
        SMK.TYPE.Query.prototype.constructor.apply( this, arguments )
    }

    $.extend( VectorQuery.prototype, SMK.TYPE.Query.prototype )

    SMK.TYPE.Query[ 'vector' ] = VectorQuery
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorQuery.prototype.canUseWithExtent = function ( viewer ) {
        return false
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorQuery.prototype.fetchUniqueValues = function ( attribute, viewer ) {
        var value = {}
        var hasNull = false
        viewer.visibleLayer[ this.layerId ].eachLayer( function ( ly ) {
            if ( ly.feature.properties[ attribute ] == null )
                hasNull = true
            else
                value[ ly.feature.properties[ attribute ] ] = true
        } )

        return SMK.UTIL.resolved( Object.keys( value ).concat( hasNull ? [ null ] : [] ) )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorQuery.prototype.queryLayer = function ( param, config, viewer ) {
        var self = this

        var layerConfig = viewer.layerId[ this.layerId ].config

        var test = makeTest( this.predicate, param )
        if ( !test ) throw new Error( 'test is empty' )

        var testGeometry = config.within
            ? function ( geometry ) { return overlapsExtent( viewer.getView().extent, geometry ) }
            : function () { return true }

        var features = []
        viewer.visibleLayer[ this.layerId ].eachLayer( function ( ly ) {
            if ( test( ly.feature.properties ) && testGeometry( ly.feature.geometry ) )
                features.push( ly.feature )
        } )

        return SMK.UTIL.resolved( features )
            .then( function ( features ) {
                // console.log( features )

                if ( !features || features.length == 0 ) throw new Error( 'no results' )

                return features.map( function ( f, i ) {
                    if ( layerConfig.titleAttribute )
                        f.title = f.properties[ layerConfig.titleAttribute ]
                    else
                        f.title = 'Feature #' + ( i + 1 )

                    return f
                } )
            } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function makeTest( predicate, param ) {
        return makeTestOperator( predicate, param )
    }

    function makeTestOperator( predicate, param ) {
        if ( !( predicate.operator in testOperator ) )
            throw new Error( 'unknown operator: ' + JSON.stringify( predicate ) )

        return testOperator[ predicate.operator ]( predicate.arguments, param )
    }

    var testOperator = {
        'and': function ( args, param ) {
            if ( args.length == 0 ) throw new Error( 'AND needs 1 or more arguments' )

            var tests = args
                .map( function ( a ) {
                    return makeTestOperator( a, param )
                } )
                .filter( function ( t ) {
                    return !!t
                } )

            if ( tests.length == 0 ) return

            return function ( properties ) {
                return tests.every( function ( t ) {
                    return t( properties )
                } )
            }
        },

        'or': function ( args, param ) {
            if ( args.length == 0 ) throw new Error( 'OR needs 1 or more arguments' )

            var tests = args
                .map( function ( a ) {
                    return makeTestOperator( a, param )
                } )
                .filter( function ( t ) {
                    return !!t
                } )

            if ( tests.length == 0 ) return

            return function ( properties ) {
                return tests.some( function ( t ) {
                    return t( properties )
                } )
            }
        },

        'equals': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'EQUALS needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return a( properties ) == b( properties )
            }
        },

        'less-than': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'LESS-THAN needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return a( properties ) < b( properties )
            }
        },

        'greater-than': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'GREATER-THAN needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return a( properties ) > b( properties )
            }
        },

        'contains': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'CONTAINS needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return ( new RegExp( b( properties ), 'i' ) ).test( a( properties ) )
            }
        },

        'starts-with': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'STARTS-WITH needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return ( new RegExp( '^' + b( properties ), 'i' ) ).test( a( properties ) )
            }
        },

        'ends-with': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'ENDS-WITH needs exactly 2 arguments' )

            var a = makeTestOperand( args[ 0 ], param )
            var b = makeTestOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return function ( properties ) {
                return ( new RegExp( b( properties ) + '$', 'i' ) ).test( a( properties ) )
            }
        },

        'not': function ( args, param ) {
            if ( args.length != 1 ) throw new Error( 'NOT needs exactly 1 argument' )

            var a = makeTestOperator( args[ 0 ], param )

            if ( !a ) return

            return function ( properties ) {
                return ! a( properties )
            }
        }
    }

    function makeTestOperand( predicate, param ) {
        if ( !( predicate.operand in testOperand ) )
            throw new Error( 'unknown operand: ' + JSON.stringify( predicate ) )

        return testOperand[ predicate.operand ]( predicate, param )
    }

    var testOperand = {
        'attribute': function ( arg, param, quote ) {
            return function ( properties ) {
                if ( !( arg.name in properties ) ) throw new Error( '"' + arg.name + '" is not a valid attribute' )
                return properties[ arg.name ]
            }
        },

        'parameter': function ( arg, param, quote ) {
            if ( !( arg.id in param ) ) throw new Error( '"' + arg.id + '" is not a valid parameter' )

            var v = param[ arg.id ].value

            if ( v == null || v === '' ) return

            return function () {
                return v
            }
        }
    }

    function overlapsExtent( extent, geom ) {
        var extentGeom = turf.bboxPolygon( extent )

        switch ( geom.type ) {
            case 'Polygon':
            case 'MultiPolygon':
                return turf.booleanOverlap( geom, extentGeom )
                    || turf.booleanCrosses( extentGeom, geom )
                    || turf.booleanContains( extentGeom, geom )
                    || turf.booleanContains( geom, extentGeom )

            case 'LineString':
            case 'MultiLineString':
                return turf.booleanCrosses( extentGeom, geom )
                    || turf.booleanContains( extentGeom, geom )

            case 'Point':
            case 'MultiPoint':
                return turf.coordReduce( geom, function ( accum, coord ) {
                    return accum || turf.booleanPointInPolygon( coord, extentGeom )
                }, false )

            default:
                console.warn( 'skip', geom.type )
                return false
        }
    }
} )
