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
        var self = this;

        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var serviceUrl  = layers[ 0 ].config.serviceUrl
        var dynamicLayers
        if ( layers[ 0 ].config.dynamicLayers )
            dynamicLayers  = layers[ 0 ].config.dynamicLayers.map( function( dl ) { return JSON.parse( dl ) } ) //.join( ',' )
        var opacity     = layers[ 0 ].config.opacity

        var minZoom
        if ( layers[ 0 ].config.minScale )
            minZoom = this.getZoomBracketForScale( layers[ 0 ].config.minScale )[ 1 ]

        var maxZoom
        if ( layers[ 0 ].config.maxScale )
            maxZoom = this.getZoomBracketForScale( layers[ 0 ].config.maxScale )[ 1 ]

        const overlayPane = self.map.getPane('overlayPane');
        const layerPane = self.map.createPane(String(layers[0].config.id), overlayPane);
        layerPane.style.zIndex = zIndex;
    
        var layer;
        if ( dynamicLayers ) {
            layer = L.esri.dynamicMapLayer( {
                url:            serviceUrl,
                opacity:        opacity,
                dynamicLayers:  dynamicLayers,
                maxZoom:        maxZoom,
                minZoom:        minZoom,
                pane:           layerPane
            });
        }
        else {
            layer = L.esri.featureLayer( {
                url:            serviceUrl,
                where:          layers[ 0 ].config.where,
                pane:           layerPane
        } )
        }
        
        layer.on( 'load', function ( ev ) {
            layers[ 0 ].loading = false
        } )

        layer.on( 'loading', function ( ev ) {
            layers[ 0 ].loading = true
        } )

        return layer
    }

} )
