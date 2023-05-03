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

    VectorLeafletLayer.prototype.getConfig = function ( leafLayer ) {
        var cfg = JSON.parse( JSON.stringify( SMK.TYPE.Layer[ 'vector' ].prototype.getConfig.call( this ) ) )

        if ( cfg.isInternal && leafLayer ) {
            var geojson = leafLayer.toGeoJSON()
            if ( geojson ) {
                cfg.dataUrl = 'data:application/json,' + JSON.stringify( geojson )
                cfg.isInternal = false
            }
        }

        return cfg
    }

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Layer[ 'vector' ][ 'leaflet' ].create = function ( layers, zIndex ) {
        var self = this

        if ( layers.length != 1 ) throw new Error( 'only 1 config allowed' )
        if ( ( layers[0].useClustering + layers[0].useHeatmap + layers[0].useRaw ) > 1 ) throw new Error( 'raw or heatmap or clustering' )

        var styles = [].concat( layers[ 0 ].config.style )

        return SMK.UTIL.resolved()
            .then( function () {
                if ( !layers[ 0 ].config.projection )
                    return L.GeoJSON.coordsToLatLng

                return SMK.UTIL.getProjection( layers[ 0 ].config.projection )
                    .then( function ( projection ) {
                        return function ( pt ) {
                            var projected = projection( pt )
                            return L.latLng( projected[ 1 ], projected[ 0 ] )
                        }
                    } )
            } )
            .then( function ( projectCoord ) {
                const layerPaneId = layers[0].config.id;
                const overlayPane = self.map.getPane('overlayPane');
                const layerPane = self.map.createPane(layerPaneId, overlayPane);
                layerPane.style.zIndex = zIndex;

                var layerOptions = {
                    coordsToLatLng: projectCoord,
                    pointToLayer: function ( geojson, latlng ) {
                        return markerForStyle( self, latlng, styles[ 0 ], layers[ 0 ].config )
                            .on( 'moveend', function ( ev ) {
                                var ll = ev.target.getLatLng()
                                layers[ 0 ].changedFeature( { newPt: { latitude: ll.lat, longitude: ll.lng }, geojson: geojson } )
                            } )
                    },
                    renderer: L.svg(),
                    interactive: false
                };
                
                if (layers[0].config.conditionalStyles) {
                    const defaultStyle = layers[0].config.style ? layers[0].config.style : {};
                    layerOptions.style = function(feature) {
                        var combinedStyle = Object.assign({}, defaultStyle);
                        layers[0].config.conditionalStyles.forEach(conditionalStyle => {
                            if (!Object.keys(feature.properties).includes(conditionalStyle.property)) {
                                console.warn(`The feature property ${conditionalStyle.property} was not found; conditional styling will not be applied for this property.`);
                                return convertStyle(combinedStyle, feature.geometry.type, layerPaneId);
                            }
                            conditionalStyle.conditions.filter(condition => matches(feature.properties[conditionalStyle.property], condition)).forEach(condition => {
                                Object.assign(combinedStyle, condition.style);
                            });
                        });
                        return convertStyle(combinedStyle, feature.geometry.type, layerPaneId);
                    };
                } else if (layers[0].config.isInternal) {
                    layerOptions.onEachFeature = function ( feature, layer ) {
                        if (layer.setStyle) {
                            layer.setStyle(convertStyle(feature.style, feature.geometry.type));
                        }
                    };
                } else {
                    layerOptions.style = function(feature) {
                        return convertStyle(layers[0].config.style, feature.geometry.type, layerPaneId);
                    };
                }

                var layer = new L.geoJson(null, layerOptions);

                if ( layers[ 0 ].config.tooltip ) {
                    layer.bindTooltip( layers[ 0 ].config.tooltip.title, Object.assign( { permanent: true }, layers[ 0 ].config.tooltip.option ) )
                }

                if ( !layers[ 0 ].config.CRS )
                    layers[ 0 ].config.CRS = 'EPSG4326'

                layers[ 0 ].loadLayer = function ( data ) {
                    // var feats = []
                    turf.featureEach( data, function ( ft ) {
                        styles.forEach( function ( st, i ) {
                            if ( i > 0 )
                                ft = turf.clone( ft )

                            ft.style = st
                            // feats.push( ft )
                            layer.addData( ft )
                        } )
                    } )

                    // layer.addData( turf.featureCollection( feats ) )
                }

                if ( layers[ 0 ].loadCache ) {
                    layers[ 0 ].loadLayer( layers[ 0 ].loadCache )
                    layers[ 0 ].loadCache = null
                }

                layers[ 0 ].clearLayer = function () {
                    layer.clearLayers()
                }

                if ( layers[ 0 ].config.isInternal ){
                    return layer
                }

                var url = self.resolveAttachmentUrl( layers[ 0 ].config.dataUrl, layers[ 0 ].config.id, 'json' )

                return SMK.UTIL.makePromise( function ( res, rej ) {
                    $.get( url, null, null, 'json' ).then( res, function ( xhr, status, err ) {
                        rej( 'Failed requesting ' + url + ': ' + xhr.status + ',' + err )
                    } )
                } )
                .then( function ( data ) {
                    console.log( 'loaded', url )

                    var feats = []
                    turf.featureEach( data, function ( ft ) {
                        styles.forEach( function ( st, i ) {
                            if ( i > 0 )
                                ft = turf.clone( ft )

                            ft.style = st
                            feats.push( ft )
                        } )
                    } )

                    layer.addData( turf.featureCollection( feats ) )

                    return layer
                } )
                .then( function ( layer ) {
                    if ( !layers[ 0 ].config.useClustering ) return layer

                    // var cluster = L.markerClusterGroup( self.clusterOption )
                    var cluster = L.markerClusterGroup( clusterOptions( layers[ 0 ].config, self ) )
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
            } )
        }

    // SMK.TYPE.Layer[ 'geojson' ].leaflet = SMK.TYPE.Layer[ 'vector' ].leaflet

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function convertStyle( styleConfig, type, layerPaneId ) {
        if ( !styleConfig ) return {}

        if ( type == 'Point' || type == 'MultiPoint' )
            return {
                radius:      styleConfig.strokeWidth / 2,
                color:       styleConfig.strokeColor,
                weight:      2,
                opacity:     styleConfig.strokeOpacity,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
                stroke:      styleConfig.stroke !== false,
                fill:        styleConfig.fill,
                pane:        layerPaneId
            }
        else
            return {
                stroke:      styleConfig.stroke !== false,
                color:       styleConfig.strokeColor,
                weight:      styleConfig.strokeWidth || 0,
                opacity:     styleConfig.strokeOpacity,
                lineCap:     styleConfig.strokeCap,
                lineJoin:    styleConfig.strokeJoin,
                dashArray:   styleConfig.strokeDashes,
                dashOffset:  styleConfig.strokeDashOffset,
                fill:        styleConfig.fill,
                fillColor:   styleConfig.fillColor,
                fillOpacity: styleConfig.fillOpacity,
                pane:        layerPaneId
                // fillRule:    styleConfig.,
            }
    }

    function matches(value, condition) {
        switch(condition.operator) {
            case '>': return validateNumber(value) && value > condition.value;
            case '>=': return validateNumber(value) && value >= condition.value;
            case '<': return validateNumber(value) && value < condition.value;
            case '<=': return validateNumber(value) && value <= condition.value;
            case '!=': return value !== condition.value;
            case 'exists': return value !== null && value !== undefined;
            case '=': return value === condition.value;
            default: return value === condition.value;
        }
    }

    function validateNumber(value) {
        if (value && Number.isNaN(parseFloat(value))) {
            console.warn(`The feature value ${value} is not a number and cannot be used in a numerical comparison. This comparison will be ignored.`);
            return false;
        }
        return true;
    }

    function markerForStyle( viewer, latlng, styleConfig, layerConfig ) {
        if ( styleConfig && styleConfig.markerUrl ) {
            return L.marker( latlng, {
                icon: L.icon( {
                    iconUrl: viewer.resolveAttachmentUrl( styleConfig.markerUrl, null, 'png' ),
                    shadowUrl: viewer.resolveAttachmentUrl( styleConfig.shadowUrl, null, 'png', false ),
                    iconSize: styleConfig.markerSize,
                    iconAnchor: styleConfig.markerOffset,
                    popupAnchor: styleConfig.popupOffset,
                    shadowSize: styleConfig.shadowSize,
                } ),
                interactive: !!layerConfig.isDraggable,
                draggable: !!layerConfig.isDraggable
            } )
        }
        else {
            return L.circleMarker( latlng, {
                interactive: false
            } )
        }
    }

    function clusterOptions( layerConfig, viewer ) {
        var opt = {}

        // For backwards compatibility, set showCoverageOnHover with
        // a 'true' value from the viewer.
        if ( viewer &&
            viewer.clusterOption &&
            !!viewer.clusterOption.showCoverageOnHover ) { 
                opt.showCoverageOnHover = viewer.clusterOption.showCoverageOnHover;
        }

        // Override showCoverageOnHover with a value from the layer if one exists
        if ( layerConfig && 
            layerConfig.clusterOption &&
            layerConfig.clusterOption.showCoverageOnHover !== undefined) {
                opt.showCoverageOnHover = layerConfig.clusterOption.showCoverageOnHover;
        }

        // If no value has been set, set to a default of 'false'.
        if (opt.showCoverageOnHover === undefined) {
            opt.showCoverageOnHover = false;
        }

        if ( layerConfig && layerConfig.clusterStyle ) {
            opt.iconCreateFunction = function( cluster ) {
                var el = $( '<div>' )
                    .append( $( '<img>' )
                        .attr( 'src', viewer.resolveAttachmentUrl( layerConfig.clusterStyle.markerUrl, null, 'png' ) )
                    )
                    .append( $( '<span>' ).text( cluster.getChildCount() ) )
                    .get( 0 ).innerHTML
    
                return L.divIcon( {
                    className: 'smk-cluster-icon',
                    html: el,
                    iconSize: layerConfig.clusterStyle.markerSize,
                    iconAnchor: layerConfig.clusterStyle.markerOffset,
                } );
            }
        }

        return opt
    }
} )
