include.module( 'layer-leaflet.layer-vector-leaflet-js', [ 'layer.layer-vector-js', 'turf' ], function () {
    "use strict";

    function VectorLeafletLayer() {
        SMK.TYPE.Layer[ 'vector' ].prototype.constructor.apply( this, arguments )
    }

    $.extend( VectorLeafletLayer.prototype, SMK.TYPE.Layer[ 'vector' ].prototype )

    SMK.TYPE.Layer[ 'vector' ][ 'leaflet' ] = VectorLeafletLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorLeafletLayer.prototype.getFeaturesInArea = function ( area, view, option ) {
        var self = this

        if ( !option.layer ) return

        var features = []

        option.layer.eachLayer( function ( ly ) {
            var ft = ly.toGeoJSON()

            switch ( ft.geometry.type ) {
            case 'Polygon':
                if ( turf.intersect( ft, area ) )
                    features.push( ft )
                break

            case 'MultiPolygon':
                var intersect = ft.geometry.coordinates.reduce( function ( accum, poly ) {
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
                console.warn( 'skip', ft.geometry.type )
            }
        } )

        return features
    }

    VectorLeafletLayer.prototype.getFeaturesAtPoint = function ( location, view, option ) {
        var self = this

        if ( !option.layer ) return

        var features = []
        var test = [ location.map.longitude, location.map.latitude ]
        var toleranceKm = option.tolerance * view.metersPerPixel / 1000;

        option.layer.eachLayer( function ( ly ) {
            var ft = ly.toGeoJSON()

            switch ( ft.geometry.type ) {
            case 'Polygon':
            case 'MultiPolygon':
                if ( turf.booleanPointInPolygon( test, ft ) ) features.push( ft )
                break

            case 'LineString':
            case 'MultiLineString':
                var close1 = turf.segmentReduce( ft, function ( accum, segment ) {
                    return accum || turf.pointToLineDistance( test, segment ) < toleranceKm
                }, false )
                if ( close1 ) features.push( ft )
                break

            case 'Point':
            case 'MultiPoint':
                var close2 = turf.coordReduce( ft, function ( accum, coord ) {
                    return accum || turf.distance( coord, test ) < toleranceKm
                }, false )
                if ( close2 ) features.push( ft )
                break

            default:
                console.warn( 'skip', ft.geometry.type )
            }
        } )

        return features
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'vector' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        var self = this

        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )
        if ( ( layers[0].useClustering + layers[0].useHeatmap + layers[0].useRaw ) > 1 ) throw new Error( 'raw or heatmap or clustering' )

        var layer = new L.geoJson( null, {
            pointToLayer: function ( geojson, latlng ) {
                return markerForStyle( self, latlng, layers[ 0 ].config.style )
            },
            onEachFeature: function ( feature, layer ) {
                if ( layer.setStyle )
                    layer.setStyle( convertStyle( layers[ 0 ].config.style, feature.geometry.type ) )
            },
            renderer: L.svg(),
            interactive: false
        } )

        layer.on( {
            add: function () {
                if ( layer.options.renderer._container )
                    layer.options.renderer._container.style.zIndex = zIndex
            }
        } )

        var url = this.resolveAttachmentUrl( layers[ 0 ].config.dataUrl, layers[ 0 ].config.id, 'json' )

        if ( !layers[ 0 ].config.CRS )
            layers[ 0 ].config.CRS = 'EPSG4326'

        return SMK.UTIL.makePromise( function ( res, rej ) {
                $.get( url, null, null, 'json' ).then( res, rej )
            } )
            .then( function ( data ) {
                console.log( 'loaded', url )
                layer.addData( data )
                return layer
            } )
            .then( function ( layer ) {
                if ( !layers[ 0 ].config.useClustering ) return layer

                var cluster = L.markerClusterGroup( self.clusterOption )
                cluster.addLayers( [ layer ] )

                return cluster
            } )
            .then( function ( layer ) {
                if ( !layers[ 0 ].config.useHeatmap ) return layer

				var points = [];
				var intensity = 100;

				layer.eachLayer( function ( ly ) {
					var centroid = turf.centroid( ly.feature.geometry )
					points.push( [ centroid.geometry.coordinates[ 1 ], centroid.geometry.coordinates[ 0 ], intensity ] )
				});

				return L.heatLayer( points, { radius: 25 } )
            } )
    }

    // SMK.TYPE.Layer[ 'geojson' ].leaflet = SMK.TYPE.Layer[ 'vector' ].leaflet

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function convertStyle( styleConfig, type ) {
        if ( type == 'Point' || type == 'MultiPoint' )
            return {
                radius:      styleConfig.strokeWidth / 2,
                color:       styleConfig.strokeColor,
                weight:      2,
                opacity:     styleConfig.strokeOpacity,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
            }
        else
            return {
                // stroke:      true,
                color:       styleConfig.strokeColor,
                weight:      styleConfig.strokeWidth,
                opacity:     styleConfig.strokeOpacity,
                // lineCap:     styleConfig.,
                // lineJoin:    styleConfig.,
                // dashArray:   styleConfig.,
                // dashOffset:  styleConfig.,
                // fill:        styleConfig.,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
                // fillRule:    styleConfig.,
            }
    }

    function markerForStyle( viewer, latlng, styleConfig ) {
        if ( styleConfig.markerUrl ) {
            return L.marker( latlng, {
                icon: styleConfig.marker || ( styleConfig.marker = L.icon( {
                    iconUrl: viewer.resolveAttachmentUrl( styleConfig.markerUrl, null, 'png' ),
                    iconSize: styleConfig.markerSize,
                    iconAnchor: styleConfig.markerOffset,
                } ) ),
                interactive: false
            } )
        }
        else {
            return L.circleMarker( latlng, {
                interactive: false
            } )
        }
    }

} )
