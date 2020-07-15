include.module( 'tool-search-leaflet', [
    'leaflet',
    'tool-search',
    'tool-search.marker-icon-yellow-png',
    'tool-search.marker-shadow-png',
    'tool-search.star-icon-yellow-png',
], function ( inc ) {
    "use strict";

    var precisionZoom = {
        INTERSECTION:   15,
        STREET:         13,
        BLOCK:          14,
        CIVIC_NUMBER:   15,
        _OTHER_:        12
    }

    var yellowMarker = new L.Icon( {
        iconUrl:        inc[ 'tool-search.marker-icon-yellow-png' ],
        shadowUrl:      inc[ 'tool-search.marker-shadow-png' ],
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    var yellowStar = new L.Icon( {
        iconUrl:        inc[ 'tool-search.star-icon-yellow-png' ],
        shadowUrl:      inc[ 'tool-search.marker-shadow-png' ],
        iconSize:       [ 20, 19 ],
        iconAnchor:     [ 10, 9 ],
        popupAnchor:    [ 1, -24 ],
        shadowSize:     [ 21, 21 ]
    } )

    var yellowStarBig = new L.Icon( {
        iconUrl:        inc[ 'tool-search.star-icon-yellow-png' ],
        shadowUrl:      inc[ 'tool-search.marker-shadow-png' ],
        iconSize:       [ 40, 36 ],
        iconAnchor:     [ 20, 18 ],
        popupAnchor:    [ 1, -24 ],
        shadowSize:     [ 31, 31 ]
    } )

    SMK.TYPE.SearchListTool.addInitializer( function ( smk ) {
        var self = this

        var vw = smk.$viewer

        var searchMarkers = L.featureGroup( { pane: 'markerPane' } )
        var pickedMarker = L.featureGroup( { pane: 'markerPane' } )

        self.changedGroup( function () {
            self.visible = self.group
        } )

        self.changedVisible( function () {
            if ( self.visible ) {
                vw.map.addLayer( searchMarkers )
                vw.map.removeLayer( pickedMarker )
            }
            else {
                vw.map.removeLayer( searchMarkers )
                vw.map.addLayer( pickedMarker )
            }
        } )

        smk.on( this.id, {
            'zoom': function () {
                var padding = smk.$viewer.getPanelPadding( true )
                smk.$viewer.map.fitBounds( searchMarkers.getBounds().pad( 0.25 ), {
                    paddingTopLeft: padding.topLeft,
                    paddingBottomRight: padding.bottomRight
                } )
            }
        } )

        vw.searched.addedFeatures( function ( ev ) {
            var padding = smk.$viewer.getPanelPadding( true )
            ev.features.forEach( function ( f ) {
                var marker = L.marker( { lat: f.geometry.coordinates[ 1 ], lng: f.geometry.coordinates[ 0 ] }, {
                    title: f.properties.fullAddress,
                    riseOnHover: true,
                    icon: yellowStar
                } )

                searchMarkers.addLayer( marker )
                f.highlightLayer = marker

                f.pickMarker = L.marker( { lat: f.geometry.coordinates[ 1 ], lng: f.geometry.coordinates[ 0 ] }, {
                    title: f.properties.fullAddress,
                    riseOnHover: true,
                    icon: yellowMarker
                } )

                marker.on( {
                    click: function ( e ) {
                        vw.searched.pick( f.id, { popupopen: true } )
                    },
                } )

            } )
        } )

        vw.searched.pickedFeature( function ( ev ) {
            if ( ev.was ) {
                var ly1 = ev.was.highlightLayer
                brightHighlight( ly1, vw.searched.isHighlighted( ev.was.id ), false )
            }

            if ( ev.feature ) {
                brightHighlight( ev.feature.highlightLayer, true, true, ev.feature )

                pickedMarker.clearLayers()
                pickedMarker.addLayer( ev.feature.pickMarker )
            }
        } )

        vw.searched.highlightedFeatures( function ( ev ) {
            if ( ev.features )
                ev.features.forEach( function ( f ) {
                    brightHighlight( f.highlightLayer, true, vw.searched.isPicked( f.id ), f )
                } )

            if ( ev.was )
                ev.was.forEach( function ( f ) {
                    brightHighlight( f.highlightLayer, false, vw.searched.isPicked( f.id ), f )
                } )
        } )

        vw.searched.clearedFeatures( function ( ev ) {
            searchMarkers.clearLayers()
            pickedMarker.clearLayers()
        } )

        function brightHighlight( highlightLayer, highlighted, picked, feature ) {
            highlightLayer.setIcon( picked ? yellowMarker : highlighted ? yellowStarBig : yellowStar )

            if ( picked && self.showFeatures != 'search-popup' ) {
                var padding = smk.$viewer.getPanelPadding( true )
                var ll = highlightLayer.getLatLng()
                smk.$viewer.map.fitBounds( L.latLngBounds( [ ll, ll ] ), {
                    paddingTopLeft: padding.topLeft,
                    paddingBottomRight: padding.bottomRight,
                    // maxZoom: 15
                    maxZoom: precisionZoom[ feature.properties.matchPrecision ] || precisionZoom._OTHER_
                } )
            }
        }
    } )

} )
