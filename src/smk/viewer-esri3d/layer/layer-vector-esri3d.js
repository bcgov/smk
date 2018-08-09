include.module( 'layer-esri3d.layer-vector-esri3d-js', [ 'layer.layer-vector-js', 'types-esri3d', 'util-esri3d', 'turf' ], function () {
    "use strict";

    var E = SMK.TYPE.Esri3d
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function VectorEsri3dLayer() {
        SMK.TYPE.Layer[ 'vector' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( VectorEsri3dLayer.prototype, SMK.TYPE.Layer[ 'vector' ].prototype )

    SMK.TYPE.Layer[ 'vector' ][ 'esri3d' ] = VectorEsri3dLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorEsri3dLayer.prototype.getFeaturesInArea = function ( area, view, option ) {
        var self = this

        if ( !option.layer ) return

        var features = []

        option.layer.graphics.forEach( function ( gr ) {
            var gm = gr.attributes._geojsonGeometry

            var ft = {
                type: 'Feature',
                properties: Object.assign( {}, gr.attributes ),
                geometry: gm
            }
            delete ft.properties._geojsonGeometry

            switch ( gm.type ) {
            case 'Polygon':
                if ( turf.intersect( ft, area ) )
                    features.push( ft )
                break

            case 'MultiPolygon':
                var intersect = gm.coordinates.reduce( function ( accum, poly ) {
                    return accum || !!turf.intersect( turf.polygon( poly ), area )
                }, false )
                if ( intersect ) features.push( ft )
                break

            case 'LineString':
                if ( turf.booleanCrosses( area, ft ) ) features.push( ft )
                break

            case 'MultiLineString':
                var close1 = turf.segmentReduce( ft, function ( accum, segment ) {
                    return accum || turf.booleanCrosses( area, segment )
                }, false )
                if ( close1 ) features.push( ft )
                break

            case 'Point':
            case 'MultiPoint':
                var close2 = turf.coordReduce( ft, function ( accum, coord ) {
                    return accum || turf.booleanPointInPolygon( coord, area )
                }, false )
                if ( close2 ) features.push( ft )
                break

            default:
                console.warn( 'skip', gm.type )
            }
        } )

        return features
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'vector' ][ 'esri3d' ].create = function ( layers, zIndex ) {
        var self = this;

        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )

        var url = this.resolveAttachmentUrl( layers[ 0 ].config.dataUrl, layers[ 0 ].config.id, 'json' )

        return SMK.UTIL.makePromise( function ( res, rej ) {
            $.get( url, null, null, 'json' ).then( function ( doc ) {
                res( doc )
            }, function () {
                rej( 'request to ' + url + ' failed' )
            } )
        } )
        .then( function ( geojson ) {
            var symbol = SMK.UTIL.smkStyleToEsriSymbol( layers[ 0 ].config.style, self )
            return new E.layers.GraphicsLayer( {
                graphics: SMK.UTIL.geoJsonToEsriGeometry( geojson, function ( t ) { return symbol[ t ] } )
            } )
        } )
    }

} )
