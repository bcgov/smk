include.module( 'layer-leaflet.layer-esri-tiled-leaflet-js', [ 'layer.layer-esri-tiled-js' ], function () {
    "use strict";

    function EsriTiledLeafletLayer() {
        SMK.TYPE.Layer[ 'esri-tiled' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( EsriTiledLeafletLayer.prototype, SMK.TYPE.Layer[ 'esri-tiled' ].prototype )

    SMK.TYPE.Layer[ 'esri-tiled' ][ 'leaflet' ] = EsriTiledLeafletLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'esri-tiled' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var self = this;
        const layerPane = self.map.getPane(SMK.TYPE.Viewer.leaflet.prototype.layerPane);
        const thisLayerPane = self.map.createPane(String(layers[0].config.id), layerPane);
        thisLayerPane.style.zIndex = zIndex;

        var serviceUrl  = layers[ 0 ].config.serviceUrl
        var opacity     = layers[ 0 ].config.opacity

        var minZoom
        if ( layers[ 0 ].config.minScale )
            minZoom = this.getZoomBracketForScale( layers[ 0 ].config.minScale )[ 1 ]

        var maxZoom
        if ( layers[ 0 ].config.maxScale )
            maxZoom = this.getZoomBracketForScale( layers[ 0 ].config.maxScale )[ 1 ]

        var layer = L.esri.tiledMapLayer({
            url: serviceUrl,
            pane: thisLayerPane
        } );
        
        layer.on( 'load', function ( ev ) {
            layers[ 0 ].loading = false
        } )

        layer.on( 'loading', function ( ev ) {
            layers[ 0 ].loading = true
        } )

        return layer
    }

} )
