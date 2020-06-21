include.module( 'tool-leaflet.tool-feature-list-leaflet-js', [ 
    'leaflet', 
    'tool-leaflet.marker-icon-white-png',
    'tool-leaflet.marker-shadow-png'
], function ( inc ) {
    "use strict";

    var whiteMarker = new L.Icon( {
        iconUrl:        inc[ 'tool-leaflet.marker-icon-white-png' ],
        shadowUrl:      inc[ 'tool-leaflet.marker-shadow-png' ],
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    return function ( smk ) {
        var self = this

        this.highlight = {}
        this.featureHighlights = L.layerGroup( { pane: 'markerPane' } )

        self.changedActive( function () {
            self.visible = self.active
        } )

        self.changedVisible( function () {
            if ( self.visible ) {
                self.featureHighlights.addTo( smk.$viewer.map )
            }
            else {
                smk.$viewer.map.removeLayer( self.featureHighlights )
            }
        } )

        self.featureSet.pickedFeature( function ( ev ) {
            if ( ev.was ) {
                showHighlight( ev.was.id, false )
            }

            if ( ev.feature ) {
                showHighlight( ev.feature.id, true )
            }
        } )

        self.featureSet.highlightedFeatures( function ( ev ) {
            if ( ev.features )
                ev.features.forEach( function ( f ) {
                    showHighlight( f.id, true )
                } )

            if ( ev.was )
                ev.was.forEach( function ( f ) {
                    if ( f && f.id )
                        showHighlight( f.id, self.featureSet.isPicked( f.id ) )
                } )
        } )

        self.featureSet.clearedFeatures( function ( ev ) {
            self.featureHighlights.clearLayers()
            self.highlight = {}
        } )

        self.featureSet.removedFeatures( function ( ev ) {
            ev.features.forEach( function ( ft ) {
                if ( self.featureSet.isPicked( ft.id ) )
                    self.featureSet.pick( null )

                self.featureHighlights.removeLayer( self.highlight[ ft.id ] )
                delete self.highlight[ ft.id ]
            } )
        } )

        self.featureSet.zoomToFeature( function ( ev ) {
            var bounds
            switch ( turf.getType( ev.feature ) ) {
            case 'Point':
                var buffered = turf.circle( ev.feature, ev.feature.radius || 100, { units: 'meters', steps: 8 } )
                var bbox = turf.bbox( buffered )
                bounds = L.latLngBounds( [ [ bbox[ 1 ], bbox[ 0 ] ], [ bbox[ 3 ], bbox[ 2 ] ] ] )
                break;

            default:
                if ( self.highlight[ ev.feature.id ] )
                    bounds = self.highlight[ ev.feature.id ].getBounds()
            }

            if ( !bounds ) return

            var padding = smk.$viewer.getPanelPadding( true )

            smk.$viewer.map
                .fitBounds( bounds, {
                    paddingTopLeft: padding.topLeft,
                    paddingBottomRight: padding.bottomRight,
                    animate: true
                } )
        } )

        function showHighlight( id, show ) {
            if ( show ) {
                if ( !self.highlight[ id ] )
                    self.highlight[ id ] = makeHighlightLayer( self.featureSet.get( id ) )

                self.featureHighlights.addLayer( self.highlight[ id ] )
            }
            else {
                if ( !self.highlight[ id ] ) return
                self.featureHighlights.removeLayer( self.highlight[ id ] )
                delete self.highlight[ id ]
            }
        }

        function makeHighlightLayer( ft ) {
            return L.geoJSON( ft.geometry, {
                pointToLayer: function ( geojson, ll ) {
                    return L.marker( ll, self.styleGeoJSON( geojson ) )
                },
                style: function ( geojson ) {
                    return self.styleGeoJSON( geojson )
                }
            } )
        }

        self.stylePoint = function ( geojson ) {
            return {
                title: geojson.title,
                icon: whiteMarker
            }
        }

        self.styleLine = function ( geojson ) {
            return {
                color:       'black',
                weight:      3,
                opacity:     0.8,
            }
        }

        self.stylePolygon = function ( geojson ) {
            return {
                color:       'black',
                weight:      3,
                opacity:     0.8,
                fillColor:   'white',
                fillOpacity: 0.5,
            }
        }

        self.styleGeoJSON = function ( geojson ) {
            var type = geojson.type

            if ( type == 'Feature' )
                type = geojson.geometry.type

            switch ( type ) {
                case 'Point':
                case 'MultiPoint':      return this.stylePoint( geojson )

                case 'LineString':
                case 'MultiLineString': return this.styleLine( geojson )

                case 'Polygon':
                case 'MultiPolygon':    return this.stylePolygon( geojson )
                // case 'GeometryCollection':
                // case 'FeatureCollection': 
            }
        }
    }

} )
