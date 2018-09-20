include.module( 'tool-search-leaflet', [ 'leaflet', 'tool-search' ], function ( inc ) {
    "use strict";

    var precisionZoom = {
        INTERSECTION:   15,
        STREET:         13,
        BLOCK:          14,
        CIVIC_NUMBER:   15,
        _OTHER_:        12
    }

    var base = include.option( 'baseUrl' ) + '/images/tool/search'

    var yellowMarker = new L.Icon( {
        iconUrl:        base + '/marker-icon-yellow.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 25, 41 ],
        iconAnchor:     [ 12, 41 ],
        popupAnchor:    [ 1, -34 ],
        shadowSize:     [ 41, 41 ]
    } )

    var yellowStar = new L.Icon( {
        iconUrl:        base + '/star-icon-yellow.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 30, 28 ],
        iconAnchor:     [ 15, 14 ],
        popupAnchor:    [ 1, -24 ],
        shadowSize:     [ 21, 21 ]
    } )

    var yellowStarBig = new L.Icon( {
        iconUrl:        base + '/star-icon-yellow.png',
        shadowUrl:      base + '/marker-shadow.png',
        iconSize:       [ 40, 36 ],
        iconAnchor:     [ 20, 18 ],
        popupAnchor:    [ 1, -24 ],
        shadowSize:     [ 31, 31 ]
    } )

    SMK.TYPE.SearchTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var vw = smk.$viewer

        var searchMarkers = L.featureGroup( { pane: 'markerPane' } )

        self.changedActive( function () {
            self.visible = self.active
        } )

        self.changedVisible( function () {
            if ( self.visible ) {
                vw.map.addLayer( searchMarkers )
            }
            else {
                // vw.searched.pick( null )
                vw.map.removeLayer( searchMarkers )
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

                if ( self.showFeatures == 'search-popup' )
                    marker.bindPopup( function () {
                        return self.popupVm.$el
                    }, {
                        maxWidth: 200,
                        autoPanPaddingTopLeft: padding.topLeft,
                        autoPanPaddingBottomRight: padding.bottomRight
                    } )

                searchMarkers.addLayer( marker )
                f.highlightLayer = marker

                marker.on( {
                    popupopen: function ( e ) {
                        vw.searched.pick( f.id, { popupopen: true } )

                        // var zoom = precisionZoom[ f.properties.matchPrecision ] || precisionZoom._OTHER_

                        // var px = vw.map.project( e.popup._latlng, zoom )
                        // px.y -= e.popup._container.clientHeight / 2
                        // px.x -= 150

                        // vw.map.flyTo( vw.map.unproject( px, zoom ), zoom, { animate: true } )
                    },
                    popupclose: function () {
                        vw.searched.pick( null, { popupclose: true } )
                    },
                } )

            } )
        } )

        vw.searched.pickedFeature( function ( ev ) {
            if ( ev.was ) {
                var ly1 = ev.was.highlightLayer
                if ( ly1.isPopupOpen() && !ev.popupclose ) ly1.closePopup()
                brightHighlight( ly1, vw.searched.isHighlighted( ev.was.id ), false )
            }

            if ( ev.feature ) {
                var ly2 = ev.feature.highlightLayer
                if ( self.showFeatures == 'search-popup' )
                    if ( !ly2.isPopupOpen() ) ly2.openPopup()
                brightHighlight( ev.feature.highlightLayer, true, true, ev.feature )
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
