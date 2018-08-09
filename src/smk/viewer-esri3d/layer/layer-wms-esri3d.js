include.module( 'layer-esri3d.layer-wms-esri3d-js', [ 'layer.layer-wms-js', 'types-esri3d' ], function () {
    "use strict";

    function WmsEsri3dLayer() {
        SMK.TYPE.Layer[ 'wms' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( WmsEsri3dLayer.prototype, SMK.TYPE.Layer[ 'wms' ].prototype )

    SMK.TYPE.Layer[ 'wms' ][ 'esri3d' ] = WmsEsri3dLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //

    var E = SMK.TYPE.Esri3d

    var WMSLayer = E.layers.BaseDynamicLayer.createSubclass( {
        properties: {
            serviceUrl: null,
            layerNames: [],
            styleNames: [],
            // imageMaxWidth: 1024,
            // imageMaxHeight: 1024,
        },

        getImageUrl: function ( extent, width, height ) {
            var epsg = extent.spatialReference.isWebMercator ? 3857 : extent.spatialReference.wkid

            var param = {
                service:        'WMS',
                request:        'GetMap',
                version:        '1.1.1',
                layers:         this.layerNames.join( ',' ),
                styles:         this.styleNames.join( ',' ),
                format:         'image/png',
                transparent:    'true',
                srs:            'EPSG:' + epsg,
                width:          width,
                height:         height,
                bbox:           [ extent.xmin, extent.ymin, extent.xmax, extent.ymax ].join( ',' )
            }

            return this.serviceUrl + '?' + Object.keys( param ).map( function ( p ) {
                return p + '=' + encodeURIComponent( param[ p ] )
            } ).join( '&' )
        }
    } )

    SMK.TYPE.Layer[ 'wms' ][ 'esri3d' ].create = function ( layers, zIndex ) {
        var serviceUrl  = layers[ 0 ].config.serviceUrl
        // var version     = layers[ 0 ].config.version || '1.1.1'
        // var attribution = layers[ 0 ].config.attribution
        var opacity     = layers[ 0 ].config.opacity

        var host = serviceUrl.replace( /^(\w+:)?[/][/]/, '' ).replace( /[/].*$/, '' )
        if ( E.config.request.corsEnabledServers.indexOf( host ) == -1 )
            E.config.request.corsEnabledServers.push( host );

        var layer = WMSLayer( {
            serviceUrl: serviceUrl,
            layerNames: layers.map( function ( c ) { return c.config.layerName } ),
            styleNames: layers.map( function ( c ) { return c.config.styleName } ),
            opacity:    opacity,
        } )

        layer.on( 'layerview-create', function ( ev ) {
            E.core.watchUtils.watch( ev.layerView, "updating", function( val ) {
                layers.forEach( function ( ly ) {
                    ly.loading = val
                } )
            } )
        } )

        return layer
    }

} )
