include.module( 'layer-esri3d.layer-esri-dynamic-esri3d-js', [ 'layer.layer-esri-dynamic-js', 'types-esri3d' ], function () {
    "use strict";

    var E = SMK.TYPE.Esri3d

    var DynamicMapLayer = E.layers.BaseDynamicLayer.createSubclass( {
        properties: {
            serviceUrl: null,
            dynamicLayers: null,
            // imageMaxWidth: 1024,
            // imageMaxHeight: 1024,
        },

        getImageUrl: function ( extent, width, height ) {
            var epsg = extent.spatialReference.isWebMercator ? 3857 : extent.spatialReference.wkid

            var param = {
                bbox:           [ extent.xmin, extent.ymin, extent.xmax, extent.ymax ].join( ',' ),
                size:           width + ',' + height,
                dpi:            96,
                format:         'png24',
                transparent:    true,
                bboxSR:         epsg,
                imageSR:        epsg,
                dynamicLayers:  JSON.stringify( this.dynamicLayers ),
                f:              'json'
            }

            var url = this.serviceUrl + '/export?' + Object.keys( param ).map( function ( p ) {
                return p + '=' + encodeURIComponent( param[ p ] )
            } ).join( '&' )

            return E.request( url )
                .then( function ( res ) {
                    return res.data.href
                } )
        },
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function EsriDynamicEsri3dLayer() {
        SMK.TYPE.Layer[ 'esri-dynamic' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( EsriDynamicEsri3dLayer.prototype, SMK.TYPE.Layer[ 'esri-dynamic' ].prototype )

    SMK.TYPE.Layer[ 'esri-dynamic' ][ 'esri3d' ] = EsriDynamicEsri3dLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'esri-dynamic' ][ 'esri3d' ].create = function ( layers, zIndex ) {
        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var serviceUrl  = layers[ 0 ].config.serviceUrl
        // var layerNames  = ( layers[ 0 ].config.layers || [] ).join( ',' )
        var dynamicLayers  = layers[ 0 ].config.dynamicLayers.map( function( dl ) { return JSON.parse( dl ) } )
        // var version     = layers[ 0 ].config.version
        // var attribution = layers[ 0 ].config.attribution
        var opacity     = layers[ 0 ].config.opacity

        var host = serviceUrl.replace( /^(\w+:)?[/][/]/, '' ).replace( /[/].*$/, '' )
        if ( E.config.request.corsEnabledServers.indexOf( host ) == -1 )
            E.config.request.corsEnabledServers.push( host );

        var layer = DynamicMapLayer( {
            serviceUrl:     serviceUrl,
            dynamicLayers:  dynamicLayers,
            opacity:        opacity,
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
