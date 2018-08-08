include.module( 'layer-leaflet.layer-esri-dynamic-leaflet-js', [ 'layer.layer-esri-dynamic-js' ], function () {
    "use strict";

    function EsriDynamicLeafletLayer() {
        SMK.TYPE.Layer[ 'esri-dynamic' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( EsriDynamicLeafletLayer.prototype, SMK.TYPE.Layer[ 'esri-dynamic' ].prototype )

    SMK.TYPE.Layer[ 'esri-dynamic' ][ 'leaflet' ] = EsriDynamicLeafletLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'esri-dynamic' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var serviceUrl  = layers[ 0 ].config.serviceUrl
        var dynamicLayers  = layers[ 0 ].config.dynamicLayers.map( function( dl ) { return JSON.parse( dl ) } ) //.join( ',' )
        var opacity     = layers[ 0 ].config.opacity

        var minZoom
        if ( layers[ 0 ].config.minScale )
            minZoom = this.getZoomBracketForScale( layers[ 0 ].config.minScale )[ 1 ]

        var maxZoom
        if ( layers[ 0 ].config.maxScale )
            maxZoom = this.getZoomBracketForScale( layers[ 0 ].config.maxScale )[ 1 ]

        var layer = L.esri.dynamicMapLayer( {
            url:            serviceUrl,
            opacity:        opacity,
            dynamicLayers:  dynamicLayers,
            maxZoom:        maxZoom,
            minZoom:        minZoom
        });

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
