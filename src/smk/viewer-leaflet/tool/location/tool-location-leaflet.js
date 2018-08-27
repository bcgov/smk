include.module( 'tool-location-leaflet', [ 'leaflet', 'tool-location' ], function ( inc ) {
    "use strict";

    var base = include.option( 'baseUrl' ) + '/images/tool/location'

    var blueIcon = new L.Icon( {
        iconUrl:        base + '/marker-icon-blue.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    SMK.TYPE.LocationTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.locationMarker = L.marker( null, { icon: blueIcon } )

        if ( !this.showPanel ) {
            this.popup = L.popup( {
                maxWidth: 100,
                closeButton: false,
            } )
            .setContent( function () { return self.vm.$el } )

            this.locationMarker
                .bindPopup( this.popup )
        }

        this.changedActive( function () {
            if ( self.active ) {
            }
            else {
                self.locationMarker.remove()
            }
        } )

        if ( self.showPanel )
            this.pickLocation = function ( location ) {
                self.locationMarker
                    .setLatLng( [ location.map.latitude, location.map.longitude ] )
                    .addTo( smk.$viewer.map )
            } 
        else 
            this.pickLocation = function ( location ) {
                self.locationMarker
                    .setLatLng( [ location.map.latitude, location.map.longitude ] )
                    .addTo( smk.$viewer.map )
                    .openPopup()
            } 
    } )


} )
