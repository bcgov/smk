include.module( 'tool-select-leaflet', [ 'leaflet', 'tool-select', 'feature-list-leaflet', 'turf' ], function ( inc ) {
    "use strict";

    SMK.TYPE.SelectTool.prototype.styleFeature = function () {
        var self = this
        return function () {
            return Object.assign( {
                color:       'blue',
                weight:      3,
                opacity:     0.7,
                dashArray:   '6,6',
                lineCap:     'butt',
                fillOpacity: 0.0,
            }, self.style )
        }
    }

    SMK.TYPE.SelectTool.prototype.afterInitialize.push( inc[ 'feature-list-leaflet' ] )

    SMK.TYPE.SelectTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.featureSet.addedFeatures( function ( ev ) {
            ev.features.forEach( function ( f ) {
                switch ( turf.getType( f ) ) {
                case 'Point':
                    self.highlight[ f.id ] = L.circleMarker( L.GeoJSON.coordsToLatLng( f.geometry.coordinates ), {
                            radius: 20
                        } )
                        .setStyle( self.styleFeature()() )
                    break;

                case 'MultiPoint':
                    break;

                default:
                    self.highlight[ f.id ] = L.geoJSON( f.geometry, {
                        style: self.styleFeature()
                    } )
                }
            } )
        } )

        if ( !self.showFeatures || self.showFeatures == 'select-popup' ) {
            self.featureSet.pickedFeature( function ( ev ) {
                if ( !ev.feature ) return

                if ( !ev.feature.center ) {
                    var center = turf.centerOfMass( ev.feature.geometry )

                    if ( center.geometry )
                        ev.feature.center = L.GeoJSON.coordsToLatLng( center.geometry.coordinates )
                    else
                        ev.feature.center = L.GeoJSON.coordsToLatLng( center.coordinates )
                }

                self.popup
                    .setLatLng( ev.feature.center )
                    .openOn( smk.$viewer.map )
            } )
        }

        var padding = smk.$viewer.getPanelPadding( true )

        self.featureSet.zoomToFeature( function ( ev ) {
            if ( !self.highlight[ ev.feature.id ] ) return

            var old = self.featureSet.pick( null )

            var bounds
            if ( self.highlight[ ev.feature.id ].getBounds ) {
                bounds = self.highlight[ ev.feature.id ].getBounds()
            }
            else if ( self.highlight[ ev.feature.id ].getLatLng ) {
                var ll = self.highlight[ ev.feature.id ].getLatLng()
                bounds = L.latLngBounds( [ ll, ll ] )
            }

            smk.$viewer.map
                .once( 'zoomend moveend', function () {
                    if ( old )
                        self.featureSet.pick( old )
                } )
                .fitBounds( bounds, {
                    paddingTopLeft: padding.topLeft,
                    paddingBottomRight: padding.bottomRight,
                    animate: true,
                    maxZoom: 12
                } )

        } )

    } )

} )
