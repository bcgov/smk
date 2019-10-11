include.module( 'query.query-place-js', [ 'query.query-js' ], function () {
    "use strict";

    function PlaceQuery() {
        SMK.TYPE.Query.prototype.constructor.apply( this, arguments )
        this.title = 'Search for location'
        this.parameters = [ {
            id: 'param1',
            type: 'input',
            title: 'Location'
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
    // PlaceQuery.prototype.fetchUniqueValues = function ( attribute, viewer ) {
    //     var value = {}
    //     var hasNull = false
    //     viewer.visibleLayer[ this.layerId ].eachLayer( function ( ly ) {
    //         if ( ly.feature.properties[ attribute ] == null )
    //             hasNull = true
    //         else
    //             value[ ly.feature.properties[ attribute ] ] = true
    //     } )

    //     return SMK.UTIL.resolved( Object.keys( value ).concat( hasNull ? [ null ] : [] ) )
    // }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    PlaceQuery.prototype.queryLayer = function ( param, config, viewer ) {
        var self = this

        // var layerConfig = viewer.layerId[ this.layerId ].config

        // var test = makeTest( this.predicate, param )

        // if ( !test ) throw new Error( 'test is empty' )

        var query = {
            ver:            1.2,
            maxResults:     20,
            outputSRS:      4326,
            addressString:  param.param1.value,
            autoComplete:   true
        }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                timeout:    10 * 1000,
                dataType:   'jsonp',
                url:        'https://apps.gov.bc.ca/pub/geocoder/addresses.geojsonp',
                data:       query,
            } ).then( res, rej )
        } )
        .then( function ( data ) {
            return data.features.map( function ( feature ) {
                if ( !feature.geometry.coordinates ) return;

                // exclude whole province match
                if ( feature.properties.fullAddress == 'BC' ) return;

                return feature
            } )
            .filter( function ( f ) { return f } )
        } )
    }

} )
