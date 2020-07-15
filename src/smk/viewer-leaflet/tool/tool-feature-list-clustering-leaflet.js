include.module( 'tool-leaflet.tool-feature-list-clustering-leaflet-js', [ 
    'leaflet', 
    'turf',
    'tool-leaflet.tool-feature-list-leaflet-js', 
    // 'tool-leaflet.marker-icon-white-png',
    // 'tool-leaflet.marker-shadow-png'
], function ( inc ) {
    "use strict";

    // var whiteMarker = new L.Icon( {
    //     iconUrl:        inc[ 'tool-leaflet.marker-icon-white-png' ],
    //     shadowUrl:      inc[ 'tool-leaflet.marker-shadow-png' ],
    //     iconSize:       [ 25, 41 ],
    //     iconAnchor:     [ 12, 41 ],
    //     popupAnchor:    [ 1, -34 ],
    //     shadowSize:     [ 41, 41 ]
    // } )

    return function ( smk ) {
        var self = this

        inc[ 'tool-leaflet.tool-feature-list-leaflet-js' ].call( this, smk )

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

        self.changedVisible( function () {
            if ( self.visible ) {
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
                    // if ( f._identifyPoint )
                        // center = [ f._identifyPoint.latitude, f._identifyPoint.longitude ]
                }

                if ( !center )
                    center = L.GeoJSON.coordsToLatLng( turf.centerOfMass( f.geometry ).geometry.coordinates )

                self.marker[ f.id ] = L.marker( center, {
                    featureId: f.id
                } )

                self.cluster.addLayer( self.marker[ f.id ] )
            } )
        } )

        self.featureSet.clearedFeatures( function ( ev ) {
            self.cluster.clearLayers()
            self.marker = {}
        } )

    }

} )
