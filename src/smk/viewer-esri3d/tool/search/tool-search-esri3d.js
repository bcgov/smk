include.module( 'tool-search-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'tool-search' ], function ( inc ) {
    "use strict";

    var precisionZoom = {
        INTERSECTION:   15,
        STREET:         13,
        BLOCK:          14,
        CIVIC_NUMBER:   15,
        _OTHER_:        12
    }

    var E = SMK.TYPE.Esri3d

    var base = include.option( 'baseUrl' ) + '/images/tool/search'

    var yellowMarkerSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-shadow.png',
                }
            },
            {
                type:       'icon',
                size:       '41px',
                anchor:     'bottom',
                resource: {
                    href:   base + '/marker-icon-yellow.png',
                }
            }
        ]
    }

    var yellowStarSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '30px',
                anchor:     'center',
                resource: {
                    href:   base + '/star-icon-yellow.png',
                }
            }
        ]
    }

    var yellowStarBigSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '40px',
                anchor:     'center',
                resource: {
                    href:   base + '/star-icon-yellow.png',
                }
            }
        ]
    }

    SMK.TYPE.SearchTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.searchLayer = new E.layers.GraphicsLayer( { visible: false } )
        smk.$viewer.map.add( self.searchLayer )

        this.changedActive( function () {
            if ( self.active ) {
                smk.$viewer.view.padding = { left: 340 }
                self.searchLayer.visible = true
            }
            else {
                smk.$viewer.view.padding = { left: 0 }
                smk.$viewer.view.popup.close()
                smk.$viewer.searched.pick( null )
                self.searchLayer.visible = false
            }
        } )

        smk.on( this.id, {
            'zoom': function () {
                smk.$viewer.view.goTo( self.searchLayer.graphics )
            }
        } )

        this.showPopup = function ( feature, loc ) {
            self.popupModel.feature = feature

            smk.$viewer.showPopup( self.popupVm.$el, loc, { title: self.title } )
        }

        this.updatePopup = function () {
            smk.$viewer.showPopup( self.popupVm.$el, null, { title: self.title } )
        }

        smk.$viewer.changedPopup( function () {
            if ( !smk.$viewer.isPopupVisible() )
                smk.$viewer.searched.pick( null )
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            return smk.$viewer.view.hitTest( location.screen )
                .then( function ( hit ) {
                    // console.log( arguments  )
                    if ( hit.results.length == 0 ) return
                    if ( !hit.results[ 0 ].graphic ) return

                    smk.$viewer.searched.pick( hit.results[ 0 ].graphic.attributes.id )
                    return true
                } )
        } )

        smk.$viewer.searched.addedFeatures( function ( ev ) {
            ev.features.forEach( function ( f ) {
                var loc = { type: 'point', latitude: f.geometry.coordinates[ 1 ], longitude: f.geometry.coordinates[ 0 ] }

                var gr = new E.Graphic( {
                    geometry: loc,
                    symbol: yellowStarSymbol,
                    attributes: {
                        id: f.id
                    }
                } )

                self.searchLayer.add( gr )

                var bgr = new E.Graphic( {
                    geometry: loc,
                    symbol: yellowStarBigSymbol,
                } )

                var mgr = new E.Graphic( {
                    geometry: loc,
                    symbol: yellowMarkerSymbol,
                } )

                f.graphic = {
                    normal:     gr,
                    highlight:  bgr,
                    pick:       mgr
                }
            } )
        } )

        smk.$viewer.searched.pickedFeature( function ( ev ) {
            if ( ev.was ) {
                showGraphic( ev.was, 'normal' )
            }

            if ( ev.feature ) {
                showGraphic( ev.feature, 'pick' )

                var loc = ev.feature.graphic.normal.geometry
                var zoom = precisionZoom[ ev.feature.properties.matchPrecision ] || precisionZoom._OTHER_

                self.showPopup()
                smk.$viewer.view.goTo( { target: loc, zoom: zoom } ).then( function () {
                    self.showPopup( ev.feature, loc )
                } )
            }
        } )

        smk.$viewer.searched.highlightedFeatures( function ( ev ) {
            if ( ev.features )
                ev.features.forEach( function ( f ) {
                    showGraphic( f, smk.$viewer.searched.isPicked( f.id ) ? 'pick' : 'highlight' )
                } )

            if ( ev.was )
                ev.was.forEach( function ( f ) {
                    showGraphic( f, smk.$viewer.searched.isPicked( f.id ) ? 'pick' : 'normal' )
                } )
        } )

        smk.$viewer.searched.clearedFeatures( function ( ev ) {
            self.searchLayer.removeAll()
            smk.$viewer.view.popup.close()
        } )

        function showGraphic( feature, graphic ) {
            self.searchLayer[ graphic == 'normal'   ? 'add': 'remove' ]( feature.graphic.normal )
            self.searchLayer[ graphic == 'highlight'? 'add': 'remove' ]( feature.graphic.highlight )
            self.searchLayer[ graphic == 'pick'     ? 'add': 'remove' ]( feature.graphic.pick )
        }
    } )

} )
