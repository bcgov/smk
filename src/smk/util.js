include.module( 'util', null, function ( inc ) {
    "use strict";

    Object.assign( window.SMK.UTIL, {
        makePromise: function( withFn ) {
            return new Promise( withFn || function () {} )
        },

        resolved: function() {
            return Promise.resolve.apply( Promise, arguments )
        },

        rejected: function() {
            return Promise.reject.apply( Promise, arguments )
        },

        waitAll: function ( promises ) {
            return Promise.all( promises )
        },

        type: function( val ) {
            var t = typeof val
            if ( t != 'object' ) return t
            if ( Array.isArray( val ) ) return 'array'
            if ( val === null ) return 'null'
            return 'object'
        },

        templatePattern: /<%=\s*(.*?)\s*%>/g,
        templateReplace: function ( template, replacer ) {
            if ( !template ) return template
            if ( !replacer ) return template

            var m = String( template ).match( this.templatePattern );
            if ( !m ) return template;

            replacer = ( function ( inner ) {
                return function ( param, match ) {
                    var r = inner.apply( null, arguments )
                    return r == null ? match : r
                }
            } )( replacer )

            if ( m.length == 1 && m[ 0 ] == template ) {
                var x = this.templatePattern.exec( template );
                return replacer( x[ 1 ], template )
            }

            return String( template ).replace( this.templatePattern, function ( match, parameterName ) {
                return replacer( parameterName, match )
            } )
        },

        isDeepEqual: function( a, b ) {
            var at = this.type( a );
            var bt = this.type( b );

            if ( at != bt ) return false;

            switch ( at ) {
            case 'array':
                if ( a.length != b.length ) return false;

                for ( var i1 = 0; i1 < a.length; i1 += 1 )
                    if ( !SMK.UTIL.isDeepEqual( a[ i1 ], b[ i1 ] ) )
                        return false

                return true;

            case 'object':
                var ak = Object.keys( a ).sort();
                var bk = Object.keys( b ).sort();

                if ( !SMK.UTIL.isDeepEqual( ak, bk ) )
                    return false

                for ( var i2 = 0; i2 < ak.length; i2 += 1 )
                    if ( !SMK.UTIL.isDeepEqual( a[ ak[ i2 ] ], b[ ak[ i2 ] ] ) )
                        return false

                return true;

            case 'string':
                return a == b;

            default:
                return String( a ) == String( b )
            }

            throw new Error( 'not supposed to be here' )
        },

        grammaticalNumber: function ( num, zero, one, many ) {
            if ( one == null ) one = zero
            if ( many == null ) many = one
            switch ( num ) {
                case 0: return zero == null ? '' : zero.replace( '{}', num )
                case 1: return one == null ? '' : one.replace( '{}', num )
                default: return many == null ? '' : many.replace( '{}', num )
            }
        },

        makeSet: function ( values ) {
            return values.reduce( function ( accum, v ) { accum[ v ] = true; return accum }, {} )
        },

        makeDelayedCall: function ( fn, option ) {
            var timeoutId

            option = Object.assign( {
                delay: 200,
            }, option )

            function cancel() {
                if ( timeoutId ) clearTimeout( timeoutId )
                timeoutId = null
            }

            var delayedCall = function () {
                var ctxt = option.context || this
                var args = option.arguments || [].slice.call( arguments )

                cancel()

                timeoutId = setTimeout( function () {
                    timeoutId = null
                    try {
                        fn.apply( ctxt, args )
                    }
                    catch ( e ) {
                        console.warn( 'during makeDelayedCall: ', e )
                    }
                }, option.delay )
            }

            delayedCall.cancel = cancel
            delayedCall.option = option

            return delayedCall
        },

        extractCRS: function ( obj ) {
            if ( obj.properties )
                if ( obj.properties.name )
                    return obj.properties.name

            throw new Error( 'unable to determine CRS from: ' + JSON.stringify( obj ) )
        },

        getProjection: function ( name ) {
            return include( 'projections' ).then( function () {
                var proj = proj4( name )
                if ( !proj ) throw new Error( 'Projection "' + name + '" is not understood' )

                return function ( pt ) {
                    return proj.inverse( pt )
                }
            } )
        },

        reprojectGeoJSON: function ( geojson, projection ) {
            return this.traverse.GeoJSON( geojson, {
                coordinate: function ( c ) {
                    return projection( c )
                }
            } )
        },

        traverse: {
            GeoJSON: function ( geojson, cb ) {
                cb = Object.assign( {
                    coordinate: function ( c ) { return c }
                }, cb )

                this[ geojson.type ]( geojson, cb )
            },

            Point: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: cb.coordinate( obj.coordinates )
                } )
            },

            MultiPoint: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: obj.coordinates.map( function ( c ) { return cb.coordinate( c ) } )
                } )
            },

            LineString: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: obj.coordinates.map( function ( c ) { return cb.coordinate( c ) } )
                } )
            },

            MultiLineString: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: obj.coordinates.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } )
                } )
            },

            Polygon: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: obj.coordinates.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } )
                } )
            },

            MultiPolygon: function ( obj, cb ) {
                return Object.assign( obj, {
                    coordinates: obj.coordinates.map( function ( ps ) { return ps.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } ) } )
                } )
            },

            GeometryCollection: function ( obj, cb ) {
                var self = this
                return Object.assign( obj, {
                    geometries: obj.geometries.map( function ( g ) { return self[ g.type ]( g, cb ) } )
                } )
            },

            FeatureCollection:  function ( obj, cb ) {
                var self = this
                return Object.assign( obj, {
                    features: obj.features.map( function ( f ) { return self[ f.type ]( f, cb ) } )
                } )
            },

            Feature: function( obj, cb ) {
                return Object.assign( obj, {
                    geometry: this[ obj.geometry.type ]( obj.geometry, cb ),
                } )
            }
        },

        circlePoints: function ( center, radius, segmentCount ) {
            var points = []
            for( var i = 0; i <= segmentCount; i += 1 )
                points.push( [
                    center.x + radius * Math.cos( 2 * Math.PI * i / segmentCount ),
                    center.y + radius * Math.sin( 2 * Math.PI * i / segmentCount )
                ] )

            return points
        },

        findNearestSite: function ( location ) {
            var query = {
                point:              [ location.longitude, location.latitude ].join( ',' ),
                outputSRS:          4326,
                locationDescriptor: 'routingPoint',
                maxDistance:        1000,
            }

            return SMK.UTIL.makePromise( function ( res, rej ) {
                $.ajax( {
                    timeout:    10 * 1000,
                    dataType:   'json',
                    url:        'https://geocoder.api.gov.bc.ca/sites/nearest.geojson',
                    data:       query,
                } ).then( res, rej )
            } )
            .then( function ( data ) {
                return {
                    longitude:           data.geometry.coordinates[ 0 ],
                    latitude:            data.geometry.coordinates[ 1 ],
                    civicNumber:         data.properties.civicNumber,
                    civicNumberSuffix:   data.properties.civicNumberSuffix,
                    fullAddress:         data.properties.fullAddress,
                    localityName:        data.properties.localityName,
                    localityType:        data.properties.localityType,
                    streetName:          data.properties.streetName,
                    streetType:          data.properties.streetType,
                    // blockID
                    // changeDate1
                    // electoralArea
                    // fullSiteDescriptor
                    // isOfficial
                    // isStreetDirectionPrefix
                    // isStreetTypePrefix
                    // locationDescriptor
                    // locationPositionalAccuracy
                    // provinceCode
                    // siteID
                    // siteName
                    // siteRetireDate
                    // siteStatus
                    // streetDirection
                    // streetQualifier
                    // unitDesignator
                    // unitNumber
                    // unitNumberSuffix
                }
            } )
            .catch( function ( err ) {
                console.warn( err.responseText )
                return location 
            } )
        },

        wrapFunction: function ( obj, fName, outer ) {
            return ( obj[ fName ] = ( function ( inner ) {
                return outer.call( null, inner )
            } )( obj[ fName ] ) )
        },

        asyncReduce: function ( cb, accum ) {
            var self = this

            return this.resolved()
                .then( function () { return accum } )
                .then( function ( arg ) {
                    var done
                    return cb( arg, function ( res ) { done = true; return res } )
                        .then( function ( res ) {
                            if ( done ) return res
                            return self.asyncReduce( cb, res )
                        } )
                } )
        },

        projection: function ( key ) {
            var keys = [].slice.call( arguments )

            return function ( obj ) {
                return keys.reduce( function ( accum, k ) {
                    if ( k in obj ) accum[ k ] = obj[ k ]
                    return accum
                }, {} )
            }
        },

        makeId: function () {
            var a = [].slice.call( arguments )
            return a
                .filter( function ( v ) { return v !== undefined } )
                .map( function ( v ) { return ( '' + v ).toLowerCase().replace( /[^a-z0-9]+/g, '-' ).replace( /^[-]|[-]$/g, '' ) } )
                .map( function ( v ) { return v ? v : '~' } )
                .join( '=' )
        },

        makeUUID: function () {
            /* jshint -W016 */
            var d = new Date().getTime()
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
                var r = ( d + Math.random() * 16 ) % 16 | 0
                d = Math.floor( d / 16 )
                return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 )
            } )
        },

        getMetersPerUnit: function ( unit ) {
            if ( !( unit in metersPerUnit ) )
                throw new Error( unit + ' is an unknown unit' )
                
            return metersPerUnit[ unit ]
        },

        makeMutex: function ( name ) {
            var mutex = [];
            return function acquire () { 
                for ( var i = 0; i < mutex.length; i += 1 ) delete mutex[ i ]
                mutex[ i ] = true;
                // console.log( 'mutex acquire', name, mutex )
                return {
                    name: name,
                    held: function () {
                        return mutex[ i ]
                    },
                    release: function () {
                        delete mutex[ i ]
                    }
                }
            }
        }
    } )

    var metersPerUnit = {
        "Mil":              2.5399999999999996e-8,
        "MicroInch":        0.0000254,
        "mm":               0.001,
        "Millimeter":       0.001,
        "cm":               0.01,
        "Centimeter":       0.01,
        "IInch":            0.0254,
        "us-in":            0.0254000508001016,
        "Inch":             0.0254000508001016,
        "in":               0.0254000508001016,
        "inches":           0.0254000508001016,
        "Decimeter":        0.1,
        "ClarkeLink":       0.201166194976,
        "SearsLink":        0.2011676512155,
        "BenoitLink":       0.20116782494375873,
        "IntnlLink":        0.201168,
        "link":             0.201168,
        "GunterLink":       0.2011684023368047,
        "CapeFoot":         0.3047972615,
        "ClarkeFoot":       0.3047972651151,
        "ind-ft":           0.30479841,
        "IndianFt37":       0.30479841,
        "SearsFoot":        0.30479947153867626,
        "IndianFt75":       0.3047995,
        "IndianFoot":       0.30479951,
        "IndianFt62":       0.3047996,
        "GoldCoastFoot":    0.3047997101815088,
        "IFoot":            0.3048,
        "Foot":             0.3048006096012192,
        "ft":               0.3048006096012192,
        "us-ft":            0.3048006096012192,
        "ModAmFt":          0.304812252984506,
        "ind-yd":           0.9143952300000001,
        "IndianYd37":       0.9143952300000001,
        "SearsYard":        0.914398414616029,
        "IndianYd75":       0.9143985000000001,
        "IndianYard":       0.9143985307444409,
        "IndianYd62":       0.9143987999999998,
        "IYard":            0.9143999999999999,
        "Yard":             0.9144018288036576,
        "yd":               0.9144018288036576,
        "us-yd":            0.9144018288036576,
        "CaGrid":           0.9997380000000001,
        "m":                1,
        "Meter":            1,
        "GermanMeter":      1.0000135965,
        "fath":             1.8287999999999998,
        "Fathom":           1.8287999999999998,
        "Rood":             3.7782668980000005,
        "Perch":            5.02921005842012,
        "Rod":              5.02921005842012,
        "Pole":             5.02921005842012,
        "Dekameter":        10,
        "Decameter":        10,
        "ClarkeChain":      20.1166194976,
        "ind-ch":           20.11669506,
        "SearsChain":       20.11676512155,
        "BenoitChain":      20.116782494375872,
        "IntnlChain":       20.1168,
        "ch":               20.1168,
        "us-ch":            20.11684023368047,
        "GunterChain":      20.11684023368047,
        "dm":               100,
        "Hectometer":       100,
        "Furlong":          201.1684023368046,
        "Brealey":          375,
        "km":               1000,
        "Kilometer":        1000,
        "IMile":            1609.344,
        "Mile":             1609.3472186944373,
        "mi":               1609.3472186944373,
        "us-mi":            1609.3472186944373,
        "kmi":              1851.9999999999998,
        "nmi":              1851.9999999999998,
        "NautM":            1852.0000000000002,
        "NautM-UK":         1853.1840000000002,
        "50kilometers":     50000,
        "Lat-66":           110943.31648893275,
        "Lat-83":           110946.25736872235,
        "dd":               111118.97383794768,
        "degrees":          111118.97383794768,
        "150kilometers":    150000
    }

} )