include.module( 'util-esri3d', [ 'types-esri3d', 'terraformer' ], function ( inc ) {
    "use strict";

    Object.assign( window.SMK.UTIL, {
        geoJsonToEsriGeometry: ( function () {
            var geoJsonHandler = {
                Point: function ( obj ) {
                    return [ Object.assign( { type: 'point' }, Terraformer.ArcGIS.convert( obj ) ) ]
                },

                MultiPoint: function ( obj ) {
                    return obj.coordinates.map( function ( c ) {
                        return geoJsonHandler.Point( { type: 'Point', coordinates: c } )
                    } )
                    .reduce( function( acc, val ) { return acc.concat( val ) }, [] )
                },

                LineString: function ( obj ) {
                    return [ Object.assign( { type: 'polyline' }, Terraformer.ArcGIS.convert( obj ) ) ]
                },

                MultiLineString: function ( obj ) {
                    return [ Object.assign( { type: 'polyline' }, Terraformer.ArcGIS.convert( obj ) ) ]
                },

                Polygon: function ( obj ) {
                    return [ Object.assign( { type: 'polygon' }, Terraformer.ArcGIS.convert( obj ) ) ]
                },

                MultiPolygon: function ( obj ) {
                    return [ Object.assign( { type: 'polygon' }, Terraformer.ArcGIS.convert( obj ) ) ]
                },

                GeometryCollection: function ( obj ) {
                    return obj.geometries.map( function ( g ) {
                        return geoJsonHandler[ g.type ]( g )
                    } )
                    .reduce( function( acc, val ) { return acc.concat( val ) }, [] )
                },

                FeatureCollection:  function ( obj, symbol ) {
                    return obj.features.map( function ( f ) {
                        return geoJsonHandler[ f.type ]( f, symbol )
                    } )
                    .reduce( function( acc, val ) { return acc.concat( val ) }, [] )
                },

                Feature:  function ( obj, symbol ) {
                    var geoms = geoJsonHandler[ obj.geometry.type ]( obj.geometry )
                    return geoms.map( function ( g ) {
                        return {
                            attributes: Object.assign( { _geojsonGeometry: obj.geometry }, obj.properties ),
                            geometry:   g,
                            symbol:     symbol( g.type, obj.properties )
                        }
                    } )
                    .reduce( function( acc, val ) { return acc.concat( val ) }, [] )
                },
            }

            return function ( geojson, symbol ) {
                if ( !symbol ) symbol = function () {}

                var eg = geoJsonHandler[ geojson.type || 'Feature' ]( geojson, symbol )
                // console.log( geojson, eg )
                return eg
            }
        } )(),


        smkStyleToEsriSymbol: function ( styleConfig, viewer ) {
            var line = {
                type: 'line-3d',
                symbolLayers: [ {
                    type: 'line',
                    size: styleConfig.strokeWidth,
                    material: {
                        color: color( styleConfig.strokeColor, styleConfig.strokeOpacity ),
                    }
                } ]
            }

            var point
            if ( styleConfig.markerUrl ) {
                point = {
                    type: 'point-3d',
                    symbolLayers: [
                        {
                            type:       'icon',
                            size:       Math.max.apply( Math, styleConfig.markerSize ) + 'px',
                            anchor:     'bottom',
                            resource: {
                                href: viewer.resolveAttachmentUrl( styleConfig.markerUrl, null, 'png' )
                            }
                        }
                    ]
                }
            }
            else {
                point = {
                    type: 'point-3d',
                    symbolLayers: [ {
                        type: 'icon',
                        size: styleConfig.strokeWidth * 2,
                        resource: {
                            primitive: 'circle'
                        },
                        material: {
                            color: color( styleConfig.fillColor, styleConfig.fillOpacity ),
                        },
                        outline: {
                            size: styleConfig.strokeWidth / 2,
                            color: color( styleConfig.strokeColor, styleConfig.strokeOpacity ),
                        }
                    } ]
                }
            }

            var fill = {
                type: 'polygon-3d',
                symbolLayers: [ {
                    type: 'fill',
                    material: {
                        color: color( styleConfig.fillColor, styleConfig.fillOpacity )
                    },
                }, line.symbolLayers[ 0 ] ]
            }

            return {
                point: point,
                // multipoint: Object.assign( point, { outline: line } ),
                polyline: line,
                polygon: fill
            }

            function color( c, a ) {
                var ec = new SMK.TYPE.Esri3d.Color( c )
                ec.a = a
                return ec
            }
        }

    } )

} )