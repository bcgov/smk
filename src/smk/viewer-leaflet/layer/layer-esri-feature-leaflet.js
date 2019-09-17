include.module( 'layer-leaflet.layer-esri-feature-leaflet-js', [ 'layer.layer-esri-feature-js' ], function () {
    "use strict";

    function EsriFeatureLeafletLayer() {
        SMK.TYPE.Layer[ 'esri-feature' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( EsriFeatureLeafletLayer.prototype, SMK.TYPE.Layer[ 'esri-feature' ].prototype )

    SMK.TYPE.Layer[ 'esri-feature' ][ 'leaflet' ] = EsriFeatureLeafletLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'esri-feature' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var serviceUrl  = layers[ 0 ].config.serviceUrl
        var opacity     = layers[ 0 ].config.opacity

        var minZoom
        if ( layers[ 0 ].config.minScale )
            minZoom = this.getZoomBracketForScale( layers[ 0 ].config.minScale )[ 1 ]

        var maxZoom
        if ( layers[ 0 ].config.maxScale )
            maxZoom = this.getZoomBracketForScale( layers[ 0 ].config.maxScale )[ 1 ]

        var layer = L.esri.featureLayer( {
            url:    serviceUrl,
            where:  layers[ 0 ].config.where
        } )
        
        layer.on( 'load', function ( ev ) {
            if ( layer._currentImage )
                layer._currentImage.setZIndex( zIndex )

            layers[ 0 ].loading = false
        } )

        layer.on( 'loading', function ( ev ) {
            layers[ 0 ].loading = true
        } )

        return layer
    }

} )
