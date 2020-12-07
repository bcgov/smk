include.module( 'tool-location-leaflet', [ 
    'leaflet', 
    'tool-location',
    'tool-location-leaflet.marker-icon-blue-png',
    'tool-location-leaflet.marker-shadow-png'
], function ( inc ) {
    "use strict";

    var blueIcon = new L.Icon( {
        iconUrl:        inc[ 'tool-location-leaflet.marker-icon-blue-png' ],
        shadowUrl:      inc[ 'tool-location-leaflet.marker-shadow-png' ],
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    SMK.TYPE.LocationTool.addInitializer( function ( smk ) {
        var self = this

        this.locationMarker = L.marker( null, { icon: blueIcon } )

        this.changedActive( function () {
            if ( self.active ) {
            }
            else {
                self.locationMarker.remove()
            }
        } )

        this.pickLocation = function ( location ) {
            self.locationMarker
                .setLatLng( [ location.map.latitude, location.map.longitude ] )
                .addTo( smk.$viewer.map )
        } 
    } )
} )
