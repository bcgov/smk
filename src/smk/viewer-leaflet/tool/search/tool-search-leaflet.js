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

        this.changedActive( function () {
            if ( self.active ) {
                vw.map.addLayer( searchMarkers )
            }
            else {
                vw.searched.pick( null )
                vw.map.removeLayer( searchMarkers )
            }
        } )

        smk.on( this.id, {
            'zoom': function () {
                smk.$viewer.map.fitBounds( searchMarkers.getBounds().pad( 0.25 ), {
                    paddingTopLeft: L.point( 340, 40 ),
                    paddingBottomRight: L.point( 40, 40 )
                } )
            }
        } )

        vw.searched.addedFeatures( function ( ev ) {
            ev.features.forEach( function ( f ) {
                var marker = L.marker( { lat: f.geometry.coordinates[ 1 ], lng: f.geometry.coordinates[ 0 ] }, {
                    title: f.properties.fullAddress,
                    riseOnHover: true,
                    icon: yellowStar
                } )
                .bindPopup( function () {
                    return self.popupVm.$el
                }, {
                    maxWidth: 200,
                    autoPanPaddingTopLeft: L.point( 300, 100 )
                } )

                searchMarkers.addLayer( marker )
                f.highlightLayer = marker

                marker.on( {
                    popupopen: function ( e ) {
                        vw.searched.pick( f.id, { popupopen: true } )

                        var zoom = precisionZoom[ f.properties.matchPrecision ] || precisionZoom._OTHER_

                        var px = vw.map.project( e.popup._latlng, zoom )
                        px.y -= e.popup._container.clientHeight / 2
                        px.x -= 150

                        vw.map.flyTo( vw.map.unproject( px, zoom ), zoom, { animate: true } )
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
                if ( !ly2.isPopupOpen() ) ly2.openPopup()
                brightHighlight( ev.feature.highlightLayer, true, true )
            }
        } )

        vw.searched.highlightedFeatures( function ( ev ) {
            if ( ev.features )
                ev.features.forEach( function ( f ) {
                    brightHighlight( f.highlightLayer, true, vw.searched.isPicked( f.id ) )
                } )

            if ( ev.was )
                ev.was.forEach( function ( f ) {
                    brightHighlight( f.highlightLayer, false, vw.searched.isPicked( f.id ) )
                } )
        } )

        vw.searched.clearedFeatures( function ( ev ) {
            searchMarkers.clearLayers()
        } )

        function brightHighlight( highlightLayer, highlighted, picked ) {
            highlightLayer.setIcon( picked ? yellowMarker : highlighted ? yellowStarBig : yellowStar )
        }
    } )

} )
