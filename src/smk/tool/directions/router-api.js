include.module( 'tool-directions.router-api-js', [], function ( inc ) {
    "use strict";

    function interpolate( p1, p2, t ) {
        return [
            p1[ 0 ] + ( p2[ 0 ] - p1[ 0 ] ) * t,
            p1[ 1 ] + ( p2[ 1 ] - p1[ 1 ] ) * t
        ]
    }

    var baseUrl = 'https://router.api.gov.bc.ca/'

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
            disable:            null,
            outputSRS:          4326,            
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

        // var query = {
        //     points:     points.map( function ( w ) { return w.longitude + ',' + w.latitude } ).join( ',' ),
        //     outputSRS:  4326,
        //     criteria:   option.criteria,
        //     roundTrip:  option.roundTrip
        // }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            ( request = $.ajax( {
                timeout:    10 * 1000,
                dataType:   'json',
                // url:        'https://routerdlv.api.gov.bc.ca/' + ( option.optimal ? 'optimalDirections' : 'directions' ) + '.json',
                // url:        'https://router.api.gov.bc.ca/' + ( option.optimal ? 'optimalDirections' : 'directions' ) + '.json',
                url:        baseUrl + endPoint,
                data:       query,
                headers: {
                    apikey: apiKey
                }
            } ) ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data.routeFound ) throw new Error( 'failed to find route' )

            if ( data.directions ) {
                data.directions = data.directions.map( function ( dir, i ) {
                    dir.instruction = dir.text.replace( /^"|"$/g, '' ).replace( /\sfor\s(\d+.?\d*\sk?m)\s[(](\d+).+?((\d+).+)?$/, function ( m, a, b, c, d ) {
                        dir.distance = a

                        if ( d )
                            dir.time = ( '0' + b ).substr( -2 ) + ':' + ( '0' + d ).substr( -2 )
                        else
                            dir.time = '00:' + ( '0' + b ).substr( -2 )

                        return ''
                    } )

                    return dir
                } )

                data.directions.unshift( {
                    instruction: 'Start!',
                    point: [ points[ 0 ].longitude, points[ 0 ].latitude ]
                } )
            }

            return data
        } )
        // uncomment to inject dummy results
        .catch( function () {
            return {
                distance: '10',
                timeText: '10 mins',
                route: points.map( function ( p ) { return [ p.longitude, p.latitude ] } ),
                directions: points
                    .map( function ( p ) {
                        return { text: 'waypoint: ' + p.longitude + ', ' + p.latitude, point: [ p.longitude, p.latitude ] }
                    } )
                    .reduce( function ( accum, v ) {
                        if ( accum.length == 0 ) {
                            accum.push( v )
                            return accum
                        }

                        var prev = accum[ accum.length - 1 ]

                        accum.push( { text: 'turn left for 1km (1:00)', point: interpolate( prev.point, v.point, 0.2 ) } )
                        accum.push( { text: 'go straight for 2km (2:00)', point: interpolate( prev.point, v.point, 0.4 ) } )
                        accum.push( { text: 'turn right for 3km (3:00)', point: interpolate( prev.point, v.point, 0.6 ) } )
                        accum.push( { text: 'go backwards for 4km (4:00)', point: interpolate( prev.point, v.point, 0.8 ) } )
                        accum.push( v )

                        return accum 
                    }, [] )
            }
        } )
    }

    return {
        setApiKey: setApiKey,
        fetchDirections: fetchDirections
    }
} )

 