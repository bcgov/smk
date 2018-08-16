include.module( 'query.query-wms-js', [ 'query.query-js' ], function () {
    "use strict";

    function WmsQuery() {
        SMK.TYPE.Query.prototype.constructor.apply( this, arguments )
    }

    $.extend( WmsQuery.prototype, SMK.TYPE.Query.prototype )

    SMK.TYPE.Query[ 'wms' ] = WmsQuery
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    WmsQuery.prototype.canUseWithExtent = function ( viewer ) {
        return !!viewer.layerId[ this.layerId ].config.geometryAttribute
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    WmsQuery.prototype.fetchUniqueValues = function ( attribute, viewer ) {
        var self = this

        var layerConfig = viewer.layerId[ this.layerId ].config
        var typeName    = layerConfig.layerName
        var serviceUrl  = layerConfig.serviceUrl

        return SMK.UTIL.asyncReduce( function ( accum, done ) {
            return fetchSomeUniqueValues( accum, serviceUrl, typeName, attribute )
                .then( function ( values ) {
                    if ( !values || values.length == 0 ) return done( accum )
                    var a = accum.concat( values )
                    if ( a.length >= self.maxUniqueValues ) done()
                    return a
                } )
        }, [] )
    }

    function fetchSomeUniqueValues( excludes, serviceUrl, typeName, attribute ) {
        var notNullExcludes = excludes.filter( function ( v ) { return v != null } )
        var filter = '(1=1)'

        if ( excludes.length != notNullExcludes.length )
            filter = '( ' + attribute + ' IS NOT NULL )'

        if ( notNullExcludes.length > 0 )
            filter += ' AND ' + attribute + ' NOT IN ( ' + notNullExcludes.map( function ( x ) { return "'" + x + "'" } ).join( ', ') + ' )'

        var data = {
            service:      "WFS",
            version:      '1.1.0',
            request:      "GetFeature",
            srsName:      'EPSG:4326',
            typename:     typeName,
            outputformat: "application/json",
            cql_filter:   filter,
            propertyName: attribute,
            maxFeatures:  10
        }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                url:        serviceUrl,
                method:     'GET',
                data:       data,
                dataType:   'json',
                // contentType:    'application/json',
                // crossDomain:    true,
                // withCredentials: true,
            } ).then( res, rej )
        } )
        .then( function ( data ) {
            // console.log( data )

            if ( !data ) return []
            if ( !data.features || data.features.length == 0 ) return []

            var value = {}
            var hasNull = false
            data.features.forEach( function ( f, i ) {
                if ( f.properties[ attribute ] == null )
                    hasNull = true
                else
                    value[ f.properties[ attribute ] ] = true
            } )

            return Object.keys( value ).concat( hasNull ? [ null ] : [] )
        } )
        .catch( function ( e ) {
            if ( e.responseText )
                throw new Error( 'Request failed: ' + e.responseText )
            throw e
        } )

    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    WmsQuery.prototype.queryLayer = function ( param, config, viewer ) {
        var self = this

        var layerConfig = viewer.layerId[ this.layerId ].config

        var filter = makeCqlClause( this.predicate, param )
        if ( !filter ) throw new Error( 'filter is empty' )

        var data = $.extend( {
            service:      "WFS",
            version:      '1.1.0',
            request:      "GetFeature",
            srsName:      'EPSG:4326',
            typename:     layerConfig.layerName,
            outputformat: "application/json",
            cql_filter:   filter,
        }, param.option );

        if ( config.within && layerConfig.geometryAttribute ) {
            data.cql_filter = '( ' + data.cql_filter + ' ) AND BBOX( ' + layerConfig.geometryAttribute + ', ' + viewer.getView().extent.join( ', ' ) + ', \'EPSG:4326\' )'
        }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                url:        layerConfig.serviceUrl,
                method:     'GET',
                data:       data,
                dataType:   'json',
                // contentType:    'application/json',
                // crossDomain:    true,
                // withCredentials: true,
            } ).then( res, rej )
        } )
        .then( function ( data ) {
            console.log( data )

            if ( !data ) throw new Error( 'no features' )
            if ( !data.features || data.features.length == 0 ) throw new Error( 'no features' )

            return data.features.map( function ( f, i ) {
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
    function makeCqlClause( predicate, param ) {
        return handleCqlOperator( predicate, param )
    }

    function handleCqlOperator( predicate, param ) {
        if ( !( predicate.operator in whereOperator ) )
            throw new Error( 'unknown operator: ' + JSON.stringify( predicate ) )

        return whereOperator[ predicate.operator ]( predicate.arguments, param )
    }

    var whereOperator = {
        'and': function ( args, param ) {
            if ( args.length == 0 ) throw new Error( 'AND needs at least 1 argument' )

            return args
                .map( function ( a ) { 
                    var c = handleCqlOperator( a, param )

                    if ( !c ) return

                    return '( ' + c + ' )' 
                } )
                .filter( function ( c ) {
                    return !!c 
                } )
                .join( ' AND ' )
        },

        'or': function ( args, param ) {
            if ( args.length == 0 ) throw new Error( 'OR needs at least 1 argument' )

            return args
                .map( function ( a ) { 
                    var c = handleCqlOperator( a, param )

                    if ( !c ) return

                    return '( ' + c + ' )' 
                } )
                .filter( function ( c ) {
                    return !!c 
                } )
                .join( ' OR ' )
        },

        'equals': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'EQUALS needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return a + ' = ' + b
        },

        'less-than': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'LESS-THAN needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return a + ' < ' + b
        },

        'greater-than': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'GREATER-THAN needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param )

            if ( !a || !b ) return

            return a + ' > ' + b
        },

        'contains': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'CONTAINS needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param, false )

            if ( !a || !b ) return

            return a + ' ILIKE \'%' + b + '%\''
        },

        'starts-with': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'STARTS-WITH needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param, false )

            if ( !a || !b ) return

            return a + ' ILIKE \'' + b + '%\''
        },

        'ends-with': function ( args, param ) {
            if ( args.length != 2 ) throw new Error( 'ENDS-WITH needs exactly 2 arguments' )

            var a = handleCqlOperand( args[ 0 ], param )
            var b = handleCqlOperand( args[ 1 ], param, false )

            if ( !a || !b ) return

            return a + ' ILIKE \'%' + b + '\''
        },

        'not': function ( args, param ) {
            if ( args.length != 1 ) throw new Error( 'NOT needs exactly 1 argument' )

            var a = handleCqlOperator( args[ 0 ], param )

            if ( !a ) return

            return 'NOT ' + a
        }
    }

    function handleCqlOperand( predicate, param, quote ) {
        if ( !( predicate.operand in whereOperand ) )
            throw new Error( 'unknown operand: ' + JSON.stringify( predicate ) )

        return whereOperand[ predicate.operand ]( predicate, param, quote )
    }

    var whereOperand = {
        'attribute': function ( arg, param, quote ) {
            if ( quote === false  )
                return '\' || ' + arg.name + ' || \''

            return arg.name
        },

        'parameter': function ( arg, param, quote ) {
            var v = param[ arg.id ].value
            if ( v == null || v === '' ) return

            return ( quote === false ? '' : '\'' ) + escapeCqlParameter( v ) + ( quote === false ? '' : '\'' )
        }
    }

    function escapeCqlParameter( p ) { return p }

} )
