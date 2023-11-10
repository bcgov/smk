include.module( 'query.query-place-js', [ 'query.query-js' ], function () {
    "use strict";

    function PlaceQuery() {
        SMK.TYPE.Query.prototype.constructor.apply( this, arguments )
        this.title = 'Location'
        this.parameters = [ {
            id: 'param1',
            type: 'input',
            title: 'Place or road name'
        } ]
    }

    $.extend( PlaceQuery.prototype, SMK.TYPE.Query.prototype )

    SMK.TYPE.Query[ 'place' ] = PlaceQuery
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    PlaceQuery.prototype.canUseWithExtent = function ( viewer ) {
        return false
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    PlaceQuery.prototype.queryLayer = function ( param, config, viewer ) {
        var self = this

        var query = {
            maxResults:     20,
            outputSRS:      4326,
            addressString:  param.param1.value,
            autoComplete:   true
        }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                timeout:    10 * 1000,
                dataType:   'jsonp',
                url:        'https://geocoder.api.gov.bc.ca/addresses.geojsonp',
                data:       query,
            } ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data ) throw new Error( 'no features' )
            if ( !data.features || data.features.length == 0 ) throw new Error( 'no features' )

            var features = data.features.map( function ( feature ) {
                    if ( !feature.geometry.coordinates ) return;

                    // exclude whole province match
                    if ( feature.properties.fullAddress == 'BC' ) return;

                    feature.radius = self.getAddressRadius( feature.properties )

                    feature.title = feature.properties.fullAddress
                    return feature
                } )
                .filter( function ( f ) { return f } )

            if ( features.length == 0 ) throw new Error( 'no features' )

            return features
        } )
    }

    PlaceQuery.prototype.getAddressRadius = function ( address ) {
        switch ( address.matchPrecision ) {
            case 'STREET':          
                return 500

            case 'INTERSECTION':    
            case 'BLOCK':           
            case 'CIVIC_NUMBER':    
                return 100

            default: return 1000
        }
    }
} )
