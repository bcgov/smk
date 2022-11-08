include.module( 'layer.layer-esri-feature-js', [ 'layer.layer-js', 'terraformer' ], function () {
    "use strict";

    function EsriFeatureLayer() {
        var self = this

        SMK.TYPE.Layer.prototype.constructor.apply( this, arguments )

        this.legendCache = SMK.UTIL.makePromise( function ( res, rej ) {
            self.legendCacheResolve = res
        } )
    }

    $.extend( EsriFeatureLayer.prototype, SMK.TYPE.Layer.prototype )

    SMK.TYPE.Layer[ 'esri-feature' ] = EsriFeatureLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    EsriFeatureLayer.prototype.initLegends = function () {
        return this.legendCache.then( function ( legends ) {
            if ( !legends ) return

            return legends.map( function ( lg ) {
                return {
                    url: 'data:image/png;base64,' + lg.imageData,
                    title: lg.label,
                    height: lg.height,
                    width: lg.width
                }
            } )
        } )
    }

    EsriFeatureLayer.prototype.getFeaturesInArea = function ( area, view, option ) {
        var self = this

        var serviceUrl  = this.config.serviceUrl + '/query'
        var esriFeature = Terraformer.ArcGIS.convert( area )

        var data = {
            f:              'json',
            inSR:           4326,
            outSR:          4326,
            tolerance:      0,
            mapExtent:      view.extent.join( ',' ),
            imageDisplay:   [ view.screen.width, view.screen.height, 96 ].join( ',' ),
            returnGeometry: true,
            returnZ:        false,
            returnM:        false,
            geometryType:   'esriGeometryPolygon',
            geometry:       JSON.stringify( esriFeature.geometry ),
            outFields:      '*'
        }

        if ( this.config.where )
            data.where = this.config.where

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.ajax( {
                url:            serviceUrl,
                type:           'post',
                data:           data,
                dataType:       'json',
            } ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data ) throw new Error( 'no features' )
            if ( !data.features || data.features.length == 0 ) throw new Error( 'no features' )

            return data.features.map( function ( r, i ) {
                var f = {}
                f.type = 'Feature';

                if ( r.displayFieldName )
                    f.title = r.attributes[ r.displayFieldName ]

                f.geometry = Terraformer.ArcGIS.parse( r.geometry )

                if ( f.geometry.type == 'MultiPoint' && f.geometry.coordinates.length == 1 ) {
                    f.geometry.type = 'Point'
                    f.geometry.coordinates = f.geometry.coordinates[ 0 ]
                }

                f.properties = r.attributes

                return f
            } )
        } )
    }

    // EsriFeatureLayer.prototype.getFeaturesAtPoint = function ( location, view, option ) {
    //     var self = this

    //     var serviceUrl  = this.config.serviceUrl + '/identify'
    //     var dynamicLayers = '[' + this.config.dynamicLayers.join( ',' ) + ']'

    //     var data = {
    //         f:              'json',
    //         dynamicLayers:  dynamicLayers,
    //         sr:             4326,
    //         tolerance:      1,
    //         mapExtent:      view.extent.join( ',' ),
    //         imageDisplay:   [ view.screen.width, view.screen.height, 96 ].join( ',' ),
    //         returnGeometry: true,
    //         returnZ:        false,
    //         returnM:        false,
    //         geometryType:   'esriGeometryPoint',
    //         geometry:       location.map.longitude + ',' + location.map.latitude,
    //         tolerance:      option.tolerance
    //     }

    //     return SMK.UTIL.makePromise( function ( res, rej ) {
    //         $.ajax( {
    //             url:            serviceUrl,
    //             type:           'post',
    //             data:           data,
    //             dataType:       'json',
    //         } ).then( res, rej )
    //     } )
    //     .then( function ( data ) {
    //         if ( !data ) throw new Error( 'no features' )
    //         if ( !data.results || data.results.length == 0 ) throw new Error( 'no features' )

    //         return data.results.map( function ( r, i ) {
    //             var f = {}

    //             if ( r.displayFieldName )
    //                 f.title = r.attributes[ r.displayFieldName ]

    //             f.geometry = Terraformer.ArcGIS.parse( r.geometry )

    //             if ( f.geometry.type == 'MultiPoint' && f.geometry.coordinates.length == 1 ) {
    //                 f.geometry.type = 'Point'
    //                 f.geometry.coordinates = f.geometry.coordinates[ 0 ]
    //             }

    //             f.properties = r.attributes

    //             return f
    //         } )
    //     } )
    // }

} )
