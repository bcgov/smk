include.module( 'feature-list-clustering-leaflet', [ 'leaflet', 'feature-list-leaflet', 'turf' ], function ( inc ) {
    "use strict";

    return function ( smk ) {
        var self = this

        inc[ 'feature-list-leaflet' ].call( this, smk )

        this.marker = {}
        this.cluster = L.markerClusterGroup( Object.assign( {
                singleMarkerMode: true,
                zoomToBoundsOnClick: false,
                spiderfyOnMaxZoom: false,
                iconCreateFunction: function ( cluster ) {
                    var count = cluster.getChildCount();

                    return new L.DivIcon( {
                        html: '<div><span>' + ( count == 1 ? '' : count > 999 ? 'lots' : count ) + '</span></div>',
                        className: 'smk-identify-cluster smk-identify-cluster-' + ( count == 1 ? 'one' : 'many' ),
                        iconSize: null
                    } )
                }
            }, smk.viewer.clusterOption ) )
            .on( {
                clusterclick: function ( ev ) {
                    var featureIds = ev.layer.getAllChildMarkers().map( function ( m ) {
                        return m.options.featureId
                    } )

                    self.featureSet.pick( featureIds[ 0 ], { cluster: true, position: ev.latlng } )
                },
                click: function ( ev ) {
                    self.featureSet.pick( ev.layer.options.featureId, { cluster: true, position: ev.latlng } )
                },
            } )

        self.changedActive( function () {
            if ( self.active ) {
                self.cluster.addTo( smk.$viewer.map )
            }
            else {
                self.cluster.remove()
            }
        } )

        self.featureSet.addedFeatures( function ( ev ) {
            ev.features.forEach( function ( f ) {
                var center
                switch ( turf.getType( f ) ) {
                case 'Point':
                    center = L.GeoJSON.coordsToLatLng( f.geometry.coordinates )
                    break;

                case 'MultiPoint':
                    if ( f._identifyPoint )
                        center = [ f._identifyPoint.latitude, f._identifyPoint.longitude ]
                    break;

                default:
                    if ( f._identifyPoint )
                        center = [ f._identifyPoint.latitude, f._identifyPoint.longitude ]

                    self.highlight[ f.id ] = L.geoJSON( f.geometry, {
                        style: self.styleFeature()
                    } )
                }

                if ( !center )
                    center = L.GeoJSON.coordsToLatLng( turf.centerOfMass( f.geometry ).geometry.coordinates )

                self.marker[ f.id ] = L.marker( center, {
                    featureId: f.id
                } )

                self.cluster.addLayer( self.marker[ f.id ] )
            } )
        } )

        self.featureSet.pickedFeature( function ( ev ) {
            if ( !ev.feature ) return

            var ly = self.marker[ ev.feature.id ]
            var parent = self.cluster.getVisibleParent( ly )

            if ( ly === parent || !parent ) {
                self.popupModel.hasMultiple = false
                self.popupFeatureIds = null
                self.popupCurrentIndex = null

                self.popup
                    .setLatLng( ly.getLatLng() )
                    .openOn( smk.$viewer.map )
            }
            else {
                var featureIds = parent.getAllChildMarkers().map( function ( m ) {
                    return m.options.featureId
                } )

                self.popupModel.hasMultiple = true
                self.popupCurrentIndex = featureIds.indexOf( ev.feature.id )
                self.popupModel.position = ( self.popupCurrentIndex + 1 ) + ' / ' + featureIds.length
                self.popupFeatureIds = featureIds

                self.popup
                    .setLatLng( parent.getLatLng() )
                    .openOn( smk.$viewer.map )
            }
        } )

        self.featureSet.zoomToFeature( function ( ev ) {
            var old = self.featureSet.pick( null )

            switch ( turf.getType( ev.feature ) ) {
            case 'Point':
                self.cluster.zoomToShowLayer( self.marker[ ev.feature.id ], function () {
                    if ( old )
                        self.featureSet.pick( old )
                } )
                break;

            default:
                if ( self.highlight[ ev.feature.id ] )
                    smk.$viewer.map
                        .once( 'zoomend moveend', function () {
                            if ( old )
                                self.featureSet.pick( old )
                        } )
                        .fitBounds( self.highlight[ ev.feature.id ].getBounds(), {
                            paddingTopLeft: self.tlPadding,
                            paddingBottomRight: self.brPadding,
                                        // paddingTopLeft: L.point( 300, 100 ),
                            animate: true
                        } )
            }
        } )

        self.featureSet.clearedFeatures( function ( ev ) {
            self.cluster.clearLayers()
            self.marker = {}
        } )

    }

} )
