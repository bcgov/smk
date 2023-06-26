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
        var self = this

        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        // var opacity     = layers[ 0 ].config.opacity

        var cfg = {
            url: layers[ 0 ].config.serviceUrl
        }

        if ( layers[ 0 ].config.scaleMin )
            cfg.minZoom = this.getZoomBracketForScale( layers[ 0 ].config.scaleMin )[ 1 ]

        if ( layers[ 0 ].config.scaleMax )
            cfg.maxZoom = this.getZoomBracketForScale( layers[ 0 ].config.scaleMax )[ 1 ]

        if ( layers[ 0 ].config.where )
            cfg.where = layers[ 0 ].config.where

        if ( layers[ 0 ].config.drawingInfo ) {
            cfg.drawingInfo = layers[ 0 ].config.drawingInfo
            if ( cfg.drawingInfo.renderer && cfg.drawingInfo.renderer.symbol && cfg.drawingInfo.renderer.symbol.url )
                // cfg.drawingInfo.renderer.symbol.url = this.resolveUrl( cfg.drawingInfo.renderer.symbol.url )
                cfg.drawingInfo.renderer.symbol.url = ( new URL( cfg.drawingInfo.renderer.symbol.url, document.location ) ).toString()
        }

        if (layers[0].config.simplifyFactor) {
            cfg.simplifyFactor = layers[0].config.simplifyFactor;
        }

        const overlayPane = self.map.getPane('overlayPane');
        const layerPane = self.map.createPane(layers[0].config.id, overlayPane);
        layerPane.style.zIndex = zIndex;
        cfg.pane = layerPane;
        
        var layer = L.esri.featureLayer( cfg )
        
        if ( layers[ 0 ].legendCacheResolve ) {
            const hideLegends = layers[0].config.hideLegends ? layers[0].config.hideLegends : [];
            layer.legend( function ( err, leg ) {
                layers[0].legendCacheResolve(err ? null : 
                    leg.layers[0].legend.filter(lg => 
                        lg.values.every(v => 
                            hideLegends.every(hl => 
                                v.toLowerCase() !== hl.toLowerCase()))));
                layers[ 0 ].legendCacheResolve = null
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
