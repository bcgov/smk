include.module( 'api.route-planner-js', [ 'jquery', 'util' ], function () {
    "use strict";

    function RoutePlanner( config ) {
        Object.assign( this, {
            url:   'https://router.api.gov.bc.ca/',
            apiKey: null
        }, config )
    }

    SMK.TYPE.RoutePlanner = RoutePlanner
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    RoutePlanner.prototype.fetchDirections = function ( points, option ) {
        var self = this

        if ( this.request )
            this.request.abort()

        var mode = Object.assign( {
            optimal:    false,
            truck:      false,  
            oversize:   false,
        }, option )

        option = Object.assign( {
            criteria:           'shortest',
            roundTrip:          false,
            correctSide:        null,
            height:             null,
            weight:             null,
            distanceUnits:      'km',
            followTruckRoute:   null,
            truckRouteMultiplier:null,
            disable:            null,
            outputSRS:          4326,       
            partition:          mode.truck ? 'isFerry,isTruckRoute,locality' : '',
        }, option )
        delete option.optimal
        delete option.truck
        delete option.oversize

        var endPoint = [
            'directions',
            'optimalDirections',
            'truck/directions',
            'truck/optimalDirections',
        ][ !!mode.optimal + 2 * !!mode.truck ] + '.json'

        var query = Object.keys( option ).reduce( function ( accum, key ) {
            if ( option[ key ] ) accum[ key ] = option[ key ]
            return accum
        }, {} )
        query.points = points.map( function ( w ) { return w.longitude + ',' + w.latitude } ).join( ',' )

        var ajaxOpt = {
            timeout:    10 * 1000,
            dataType:   'json',
            url:        this.url + endPoint,
            data:       query,
            headers: {
                apikey: this.apiKey
            }
        }

        var result = SMK.UTIL.makePromise( function ( res, rej ) {
            ( self.request = $.ajax( ajaxOpt ) ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data.routeFound ) throw new Error( 'failed to find route' )

            function getDirections( pt ) {
                return data.directions.filter( function ( dr ) {
                    return close( dr.point, pt, 0.00001 )
                } )
            }

            if ( data.directions ) {
                data.directions = data.directions.map( function ( dir, i ) {
                    if ( dir.distance != null ) {
                        dir.distanceUnit = appropriateUnit( dir.distance * 1000 )
                        return dir
                    }
                        
                    // TODO remove
                    dir.instruction = dir.text.replace( /^"|"$/g, '' ).replace( /\s(?:for|and travel)\s((?:\d+.?\d*\s)?k?m)\s[(](\d+).+?((\d+).+)?$/, function ( m, a, b, c, d ) {
                        dir.distanceUnit = { value: dir.distance, unit: '' }

                        if ( d )
                            dir.time = parseInt( b ) * 60 + parseInt( d ) 
                        else
                            dir.time = parseInt( b ) 

                        return ''
                    } )

                    return dir
                } )
            }

            if ( data.route ) {
                if ( data.partitions ) {
                    var routeLen = data.route.length
                    var len = data.partitions.length

                    if ( data.partitions[ len - 1 ].index < ( routeLen - 1 ) ) {
                        data.partitions.push( { index: routeLen - 1 } )
                        len += 1
                    }

                    data.segments = []
                    for ( var pi = 1; pi < len; pi += 1 ) {
                        var prop = data.partitions[ pi - 1 ]
                        prop.isOversize = !!mode.oversize
                        
                        data.segments.push( turf.lineString( data.route.slice( prop.index, data.partitions[ pi ].index + 1 ), prop ) )
                    }
                } else if (option.rangeKm > 0 && data.distance && option.rangeKm < data.distance) {
                    data.segments = [];
                    var distanceKm = 0;
                    var routeIndex = 0;
                    // Capture the route segment where the range limit is reached
                    for (var i = 0; i < (data.route.length - 1); i += 1) {
                        distanceKm += turf.distance(data.route[i], data.route[i+1], {units: "kilometers"});
                        if (distanceKm >= option.rangeKm && i > 0) {
                            data.rangeLimit = data.route[i - 1];
                            routeIndex = i - 1;
                            break;
                        }
                    }
                    // If rangeKm is close enough to data.distance, we may not hit the break above and routeIndex will remain 0
                    if (routeIndex === 0) {
                        data.segments = [turf.lineString(data.route, { index: 0 })];
                    } else {
                        // Add two segments - one before the range limit is reached, one after
                        data.segments.push(turf.lineString(data.route.slice(0, routeIndex), { index: 0 }));
                        data.segments.push(turf.lineString(data.route.slice(routeIndex), { index: 1, "@layer": "@segments-after-range-limit" }));
                    }
                } else {
                    data.segments = [ turf.lineString( data.route, { index: 0 } ) ]
                }

                data.segments = turf.featureCollection( data.segments )
                data.segments.properties = {
                    isOversize: !!mode.oversize
                }

                var routeAttrs = data.route.map( function () { return { segs: {} } } )

                data.segments.features.forEach( function ( sg, i ) {
                    for ( var j = 0; j < sg.geometry.coordinates.length; j += 1 ) {
                        var ri = j + sg.properties.index

                        routeAttrs[ ri ].segs[ i ] = true
                        routeAttrs[ ri ].dirs = getDirections( data.route[ ri ] )
                        routeAttrs[ ri ].index = ri

                        for ( var k = 0; k < routeAttrs[ ri ].dirs.length; k += 1 )  
                            routeAttrs[ ri ].dirs[ k ].segmentIndex = i
                    }
                } )

                var problems = [];

                // When there's a range and we've created two segments, this code results in an increase in the number of directions
                if (option.rangeKm === null) {
                    // segments that start/end on a node without a direction are a problem
                    problems = routeAttrs.filter( function ( ra ) {
                        return Object.keys( ra.segs ).length > 1 && ra.dirs.length == 0
                    } )
                }

                if ( problems.length > 0 ) {
                    problems.forEach( function ( p ) {
                        p.dirs = [ {
                            type: 'CONTINUE',
                            point: JSON.parse( JSON.stringify( data.route[ p.index ] ) ),
                            segmentIndex: Math.max.apply( Math, Object.keys( p.segs ) )
                        } ]
                    } )

                    data.directions = routeAttrs
                        .map( function ( ra ) { return ra.dirs } )
                        .filter( function ( d ) { return !!d } )
                        .reduce( function ( acc, v ) { return acc.concat( v ) }, [] )
                }
            }

            data.request = ajaxOpt

            return data
        } )

        return result
    }

    function interpolate( p1, p2, t ) {
        return [
            p1[ 0 ] + ( p2[ 0 ] - p1[ 0 ] ) * t,
            p1[ 1 ] + ( p2[ 1 ] - p1[ 1 ] ) * t
        ]
    }

    function appropriateUnit( m ) {
        if ( m <= 500 ) return { value: m, unit: 'meters' }
        return { value: m, unit: 'kilometers' }
    }

    function close( p1, p2, min ) { 
        var d0 = p1[0] - p2[0]
        var d1 = p1[1] - p2[1]
        return ( d0 * d0 + d1 * d1 ) <= ( min * min )
    }
} )

 