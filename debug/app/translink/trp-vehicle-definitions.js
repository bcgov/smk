( function () {
'use strict'

var TRP = window.TRP || ( window.TRP = {} )

// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// 

TRP.vehicleTypes = []

function addVehicleType( opt, configs ) {
    opt = Object.assign( {
        id: '[missing]',
        image: '[missing]',
        title: '[missing]',
    }, opt )

    opt.configs = configs

    var last = JSON.parse( JSON.stringify( configs[ configs.length - 1] ) )
    last.axles = ( last.axles + 1 ) + '+'
    last.default = false
    last.oversize = true

    opt.configs.push( last )

    TRP.vehicleTypes.push( opt )
} 

addVehicleType( 
    {
        id: 'straight',
        image: 'images/trucks/truck-straight.svg',
        title: 'Straight Truck',
    },
    [
        {
            default: true,
            axles: 2,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 18200
        },
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 26100
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 34000
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 39200
        }
    ]
)

addVehicleType( 
    {
        id: 'straight-pony-trailer',
        image: 'images/trucks/truck-straight-pony-trailer.svg',
        title: 'Straight Truck and Pony Trailer',
    },
    [
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 27300
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 35200
        },
        {
            default: true,
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 43100
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 50100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 56200
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 60200
        }
    ]
)

addVehicleType( 
    {
        id: 'straight-full-trailer',
        image: 'images/trucks/truck-straight-full-trailer.svg',
        title: 'Straight Truck and Full Trailer',
    },
    [
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 36400
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 44300
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 52200
        },
        {
            default: true,
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 60100
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        }
    ]
)

addVehicleType( 
    {
        id: 'tractor-semi-trailer',
        image: 'images/trucks/truck-tractor-semi-trailer.png',
        title: 'Tractor Semi-Trailer',
    },
    [
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 24200
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 32100
        },
        {
            default: true,
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 40000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 47000
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 55300
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 57100
        }
    ]
)

addVehicleType( 
    {
        id: 'a-train',
        image: 'images/trucks/truck-a-train.svg',
        title: 'A Train (Double Trailer)',
    },
    [
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 38000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 50300
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 11,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        }
    ]
)

addVehicleType( 
    {
        id: 'b-train',
        image: 'images/trucks/truck-b-train.svg',
        title: 'B Train (Double Trailer)',
    },
    [
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 38000
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 41200
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 49100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 57000
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        }
    ]
)

addVehicleType( 
    {
        id: 'c-train',
        image: 'images/trucks/truck-c-train.svg',
        title: 'C Train (Double Trailer)',
    },
    [
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 38000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 49100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 57000
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 11,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        }
    ]
)

addVehicleType( 
    {
        id: 'bus',
        image: 'images/trucks/truck-bus.svg',
        title: 'Bus',
    },
    [
        {
            axles: 2,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 16350
        },
        {
            default: true,
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 14,
            weight: 24250
        }
    ]
)

addVehicleType( 
    {
        id: 'other',
        image: 'images/trucks/truck-other.svg',
        title: 'Other',
    },
    [
        {
            default: true,
            axles: 8,
            height: 4.16,
            width: 2.61,
            length: 27.51,
            weight: 63501
        }
    ]
)

// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// 

TRP.getMunicipalityDefinition = function ( muni ) {
    return municipality[ ( muni || '_default_' ).toLowerCase() ] || municipality[ '_default_' ]
}

TRP.isHeavyTruckInMunicipality = function ( muni, weight ) {
    return weight >= this.getMunicipalityDefinition( muni ).truckWeightDefinition 
}

var municipality = {
    '_default_':                    { truckWeightDefinition:  13600 },
    'anmore':                       { truckWeightDefinition:  11794 },
    'belcarra':                     { truckWeightDefinition:  10900 },
    'bowen island':                 { truckWeightDefinition:  11800 },
    'burnaby':                      { truckWeightDefinition:  13600 },
    'coquitlam':                    { truckWeightDefinition:  11800 },
    'delta':                        { truckWeightDefinition:  11800 },
    'langley':                      { truckWeightDefinition:  11800 },
    'langley city':                 { truckWeightDefinition:  11800 },
    'langley township':             { truckWeightDefinition:  11800 },
    'township of langley':          { truckWeightDefinition:  11800 },
    'lions bay':                    { truckWeightDefinition: 300000 },
    'maple ridge':                  { truckWeightDefinition: 300000 },
    'new westminster':              { truckWeightDefinition:  11800 },
    'north vancouver':              { truckWeightDefinition:  11800 },
    'north vancouver city':         { truckWeightDefinition:  11800 },
    'north vancouver district':     { truckWeightDefinition: 300000 },
    'district of north vancouver':  { truckWeightDefinition: 300000 },
    'pitt meadows':                 { truckWeightDefinition:  10000 },
    'port coquitlam':               { truckWeightDefinition:  11794 },
    'port moody':                   { truckWeightDefinition:  10000 },
    'richmond':                     { truckWeightDefinition: 300000 },
    'surrey':                       { truckWeightDefinition:  11800 },
    'ubc':                          { truckWeightDefinition: 300000 },
    'vancouver':                    { truckWeightDefinition:  11800 },
    'west vancouver':               { truckWeightDefinition:  11800 },
    'white rock':                   { truckWeightDefinition:   5500 },
}

// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// 

TRP.makeReports = function ( routeResponse ) {
    var reports = clone( routeResponse.notifications || [] )
        .filter( function ( r ) {
            return r.type != 'Oversize'
        } )
        .map( function ( r ) {
            return {
                type: r.type,
                component: {
                    template: '<div>' + r.message + '</div>',
                    dataObj: {}
                }
            }
        } )

    var muni = {}
    routeResponse.segments.features.forEach( function ( s ) {
        muni[ s.properties.locality ] = true
    } )

    var notHeavyTruckMunis = Object.keys( muni ).filter( function ( m ) { 
        return !TRP.isHeavyTruckInMunicipality( m, routeResponse.request.data.weight ) 
    } )

    return include( [ 
        { url: './fragments/report-not-heavy-truck.html' }, 
        { url: './fragments/report-truck.html' }, 
        { url: './fragments/report-direction-notification.html' },
        { url: './fragments/report-oversize.html' } 
    ], 'report' )
        .then( function ( inc ) {
            routeResponse.directions.forEach( function ( d ) {
                if ( !d.notifications ) return

                d.notifications.forEach( function ( n ) {
                    reports.push( {
                        type: n.type,
                        component: {
                            template: inc[ 'report.report-direction-notification-html' ],
                            dataObj: Object.assign( clone( n ), {
                                direction: clone( d ),
                                segment: clone( routeResponse.segments.features[ d.segmentIndex ].properties )                                        
                            } )
                        }
                    } )
                } )
            } )

            reports.push( {
                type: 'TruckRestriction',
                component: {
                    template: inc[ 'report.report-not-heavy-truck-html' ],
                    dataObj: {
                        municipalities: notHeavyTruckMunis
                    }
                }
            } )

            if ( routeResponse.segments.properties.isOversize )
                reports.push( {
                    type: 'TruckRestriction',
                    component: {
                        template: inc[ 'report.report-oversize-html' ],
                        dataObj: {}
                    }
                } )
            else
                reports.push( {
                    type: 'TruckRestriction',
                    component: {
                        template: inc[ 'report.report-truck-html' ],
                        dataObj: {}
                    }
                } )

            return reports
        } )
}

// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// 

function clone( obj ) { return JSON.parse( JSON.stringify( obj ) ) }

} )()
