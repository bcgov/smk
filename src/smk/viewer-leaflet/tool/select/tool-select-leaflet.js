include.module( 'tool-select-leaflet', [
    'leaflet',
    'tool-select',
    'tool-leaflet',
    'tool-leaflet.tool-feature-list-leaflet-js'
], function ( inc ) {
    "use strict";

    SMK.TYPE.SelectListTool.addInitializer( function () {
        this.styleFeature = function () {
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
    } )

    SMK.TYPE.SelectListTool.addInitializer( function ( smk ) {
        var self = this

        inc[ 'tool-leaflet.tool-feature-list-leaflet-js' ].call( this, smk )

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

    } )
} )


