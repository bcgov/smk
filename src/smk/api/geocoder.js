include.module( 'api.geocoder-js', [ 'jquery', 'util' ], function () {
    "use strict";

    function Geocoder( config ) {
        Object.assign( this, {
            timeout:    10 * 1000,
            url:        'https://geocoder.api.gov.bc.ca/',
            parameter:  {}
        }, config )
    }

    SMK.TYPE.Geocoder = Geocoder
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Geocoder.prototype.fetchAddresses = function ( address, option ) {
        option = Object.assign( {
            maxResults:         20,
            outputSRS:          4326,
            addressString:      address,
            autoComplete:       true,
            locationDescriptor: 'accessPoint'
        }, this.parameter, option )

        delete option.maxDistance
        delete option.locationMode

        return this.fetchGeocoder( 'addresses', option )
            .then( function ( data ) {
                return data.features
                    .filter( function ( feature ) {
                        if ( !feature.geometry.coordinates ) return false
                        if ( feature.properties.fullAddress == 'BC' ) return false
                        return true
                    } )
                    .map( function ( feature ) {
                        return {
                            longitude:           feature.geometry.coordinates[ 0 ],
                            latitude:            feature.geometry.coordinates[ 1 ],
                            civicNumber:         feature.properties.civicNumber,
                            civicNumberSuffix:   feature.properties.civicNumberSuffix,
                            fullAddress:         feature.properties.fullAddress,
                            localityName:        feature.properties.localityName,
                            localityType:        feature.properties.localityType,
                            streetName:          feature.properties.streetName,
                            streetType:          feature.properties.streetType,
                            siteName:            feature.properties.siteName,
                            matchPrecision:      feature.properties.matchPrecision,
                        }                        
                    } )
            } )

    }
    
    Geocoder.prototype.fetchNearestSite = function ( location, option ) {
        option = Object.assign( {
            locationOut:        'geocoder',
            point:              [ location.longitude, location.latitude ].join( ',' ),
            outputSRS:          4326,
            locationDescriptor: 'routingPoint',
            maxDistance:        1000,
        }, this.parameter, option )

        var locationOut = option.locationOut
        delete option.locationOut

        return this.fetchGeocoder( 'sites/nearest', option )
            .then( function ( data ) {
                var site = {
                    civicNumber:         data.properties.civicNumber,
                    civicNumberSuffix:   data.properties.civicNumberSuffix,
                    fullAddress:         data.properties.fullAddress,
                    localityName:        data.properties.localityName,
                    localityType:        data.properties.localityType,
                    streetName:          data.properties.streetName,
                    streetType:          data.properties.streetType,
                    siteName:            data.properties.siteName,
                    matchPrecision:      data.properties.matchPrecision,
                }

                if ( locationOut == 'geocoder' ) {
                    site.longitude  = data.geometry.coordinates[ 0 ]
                    site.latitude   = data.geometry.coordinates[ 1 ]
                }
                else if ( locationOut == 'input' ) { 
                    site = Object.assign( site, location )
                }

                return site
            } )
            .catch( function ( err ) {
                console.debug( err.responseText )
                return location 
            } )
    }

    Geocoder.prototype.fetchIntersections = function ( points, option ) {}
    Geocoder.prototype.fetchOccupants = function ( points, option ) {}
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Geocoder.prototype.fetchGeocoder = function ( endpoint, query ) {
        var self = this

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                timeout:    self.timeout,
                dataType:   'json',
                url:        self.url + endpoint + '.geojson',
                data:       query,
            } ).then( res, rej )
        } )
    }

} )

 
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
