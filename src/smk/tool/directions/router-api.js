include.module( 'tool-directions.router-api-js', [], function ( inc ) {
    "use strict";

    // var baseUrl = 'https://router.api.gov.bc.ca/'
    var baseUrl = 'https://ssl.refractions.net/ols/router/'

    var directionType = {
        START:              [ 'trip_origin' ],
        CONTINUE:           [ 'expand_more' ],
        TURN_LEFT:          [ 'arrow_back' ],
        TURN_SLIGHT_LEFT:   [ 'undo' ],
        TURN_SHARP_LEFT:    [ 'directions', true ],
        TURN_RIGHT:         [ 'arrow_forward' ],
        TURN_SLIGHT_RIGHT:  [ 'undo', true ],
        TURN_SHARP_RIGHT:   [ 'directions' ],
        FERRY:              [ 'directions_boat' ],
        STOPOVER:           [ 'pause' ],
        FINISH:             [ 'stop' ],
    }

    var apiKey
    function setApiKey( key ) {
        apiKey = key
    }

    var request
    function fetchDirections( points, option ) {
        option = Object.assign( {
            criteria:           'shortest',
            roundTrip:          false,
            optimal:            false,
            truck:              false,  
            correctSide:        null,
            height:             null,
            weight:             null,
            distanceUnits:      'km',
            followTruckRoute:   null,
            truckRouteMultiplier:null,
            disable:            null,
            outputSRS:          4326,       
            partition:          'isFerry,isTruckRoute'
        }, option )

        if ( request )
            request.abort()

        var optimal = !!option.optimal
        delete option.optimal

        var truck = !!option.truck
        delete option.truck

        var endPoint = [
            'directions',
            'optimalDirections',
            'truck/directions',
            'truck/optimalDirections',
        ][ optimal + 2 * truck ] + '.json'

        var query = Object.fromEntries( Object.entries( option ).filter( function( kv ) { return !!kv[ 1 ] } ) )
        query.points = points.map( function ( w ) { return w.longitude + ',' + w.latitude } ).join( ',' )

        var ajaxOpt = {
            timeout:    10 * 1000,
            dataType:   'json',
            url:        baseUrl + endPoint,
            data:       query,
            headers: {
                apikey: apiKey
            }
        }

        var result = SMK.UTIL.makePromise( function ( res, rej ) {
            ( request = $.ajax( ajaxOpt ) ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data.routeFound ) throw new Error( 'failed to find route' )

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

            // SMK.HANDLER.get( self.id, 'activated' )( smk, self, el )

            if ( data.route ) {
                // var ls = turf.lineString( data.route )

                if ( data.partitions ) {
                    var routeLen = data.route.length
                    var len = data.partitions.length

                    if ( data.partitions[ len - 1 ].index < ( routeLen - 1 ) ) {
                        data.partitions.push( { index: routeLen - 1 } )
                        len += 1
                    }

                    data.segments = []
                    for ( var pi = 1; pi < len; pi += 1 ) {
                        data.segments.push( turf.lineString( data.route.slice( data.partitions[ pi - 1 ].index, data.partitions[ pi ].index + 1 ), data.partitions[ pi - 1 ] ) )
                    }


                    // data.segments = turf.lineSegment( ls ).features                   

                    // data.partitions.forEach( function ( p ) {
                    //     var start = p.index
                    //     var prop = JSON.parse( JSON.stringify( p ) )
                    //     delete prop.index

                    //     for ( var i = start; i < data.segments.features.length; i += 1 ) {
                    //         data.segments.features[ i ].properties = Object.assign( {}, prop )
                    //     }
                    // } )
                }
                else {
                    data.segments = [ turf.lineString( data.route ) ]
                }

                if ( SMK.HANDLER.has( 'directions', 'style-route' ) )
                    SMK.HANDLER.get( 'directions', 'style-route' )( data.segments )

                data.segments = turf.featureCollection( data.segments )
            }

            data.request = ajaxOpt

            return data
        } )

        if ( !apiKey ) return result

        return result.catch( function () {
            return {
                distance: '10',
                timeText: '10 mins',
                route: points.map( function ( p ) { return [ p.longitude, p.latitude ] } )
                    .reduce( function ( accum, v ) {
                        if ( accum.length == 0 ) {
                            accum.push( v )
                            return accum
                        }

                        var prev = accum[ accum.length - 1 ]

                        accum.push( interpolate( prev, v, 0.2 ) )
                        accum.push( interpolate( prev, v, 0.4 ) )
                        accum.push( interpolate( prev, v, 0.6 ) )
                        accum.push( interpolate( prev, v, 0.8 ) )
                        accum.push( v )

                        return accum 
                    }, [] ),
                directions: points
                    .map( function ( p ) {
                        return { instruction: 'waypoint: ' + p.longitude + ', ' + p.latitude, point: [ p.longitude, p.latitude ] }
                    } )
                    .reduce( function ( accum, v ) {
                        if ( accum.length == 0 ) {
                            accum.push( v )
                            return accum
                        }

                        var prev = accum[ accum.length - 1 ]

                        accum.push( { instruction: 'turn left for 1km (1:00)', point: interpolate( prev.point, v.point, 0.2 ) } )
                        // accum.push( { instruction: 'go straight for 2km (2:00)', point: interpolate( prev.point, v.point, 0.4 ) } )
                        accum.push( { instruction: 'turn right for 3km (3:00)', point: interpolate( prev.point, v.point, 0.6 ) } )
                        // accum.push( { instruction: 'go backwards for 4km (4:00)', point: interpolate( prev.point, v.point, 0.8 ) } )
                        accum.push( v )

                        return accum 
                    }, [] )
            }
        } )
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

    return {
        setApiKey: setApiKey,
        fetchDirections: fetchDirections
    }
} )

 