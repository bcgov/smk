include.module( 'layer-leaflet.layer-wms-leaflet-js', [ 'layer.layer-wms-js' ], function () {
    "use strict";

    function WmsLeafletLayer() {
        SMK.TYPE.Layer[ 'wms' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( WmsLeafletLayer.prototype, SMK.TYPE.Layer[ 'wms' ].prototype )

    SMK.TYPE.Layer[ 'wms' ][ 'leaflet' ] = WmsLeafletLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'wms' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        var serviceUrl  = layers[ 0 ].config.serviceUrl
        var layerNames  = layers.map( function ( c ) { return c.config.layerName } ).join( ',' )
        var styleNames  = layers.map( function ( c ) { return c.config.styleName } ).join( ',' )
        var version     = layers[ 0 ].config.version || '1.1.1'
        var attribution = layers[ 0 ].config.attribution
        var opacity     = layers[ 0 ].config.opacity

        var layer = L.nonTiledLayer.wms( serviceUrl, {
            layers:         layerNames,
            styles:         styleNames,
            version:        version,
            attribution:    attribution,
            opacity:        opacity,
            format:         'image/png',
            transparent:    true,
            zIndex:         zIndex
        } )

        layer.on( 'load', function ( ev ) {
            layers.forEach( function ( ly ) {
                ly.loading = false
            } )
        } )

        layer.on( 'loading', function ( ev ) {
            layers.forEach( function ( ly ) {
                ly.loading = true
            } )
        } )

        return layer
    }

} )
