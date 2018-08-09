include.module( 'feature-list-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'feature-list' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    var markerSymbol = {
        type: 'point-3d',
        symbolLayers: [
            {
                type:       'icon',
                size:       '20px',
                anchor:     'center',
                material: {
                    color: 'white'
                },
                resource: {
                    primitive: 'circle'
                },
                outline: {
                    color: 'blue',
                    size: '2px'
                }
            }
        ]
    }

    return function ( smk ) {
        var self = this

        this.featureListLayer = new E.layers.GraphicsLayer( { visible: false, elevationInfo: { mode: 'on-the-ground' } } )
        smk.$viewer.map.add( this.featureListLayer )

        this.highlight = {}

        this.changedActive( function () {
            if ( self.active ) {
                if ( self.showPanel )
                    smk.$viewer.view.padding = { left: 340 }
                self.featureListLayer.visible = true
            }
            else {
                smk.$viewer.view.padding = { left: 0 }
                self.featureListLayer.visible = false
                smk.$viewer.hidePopup()
            }
        } )

        smk.$viewer.changedPopup( function () {
            if ( !smk.$viewer.isPopupVisible() )
                self.featureSet.pick( null )
        } )

        this.showPopup = function ( loc ) {
            smk.$viewer.showPopup( self.popupVm.$el, loc, { title: self.title } )
        }

        this.updatePopup = function () {
            smk.$viewer.showPopup( self.popupVm.$el, null, { title: self.title } )
        }

        self.featureSet.clearedFeatures( function ( ev ) {
            self.featureListLayer.removeAll()
            self.highlight = {}
        } )

        self.featureSet.removedFeatures( function ( ev ) {
            ev.features.forEach( function ( ft ) {
                if ( self.featureSet.isPicked( ft.id ) )
                    self.featureSet.pick( null )

                self.featureListLayer.removeMany( self.highlight[ ft.id ] )
                delete self.highlight[ ft.id ]
            } )
        } )

        var styleHighlight = SMK.UTIL.smkStyleToEsriSymbol( self.styleFeature( { strokeWidth: 4, strokeOpacity: 0.2, fillOpacity: 0.3 } ) ),
            styleHighlightFn = function ( type ) { return styleHighlight[ type ] }

        var stylePick = SMK.UTIL.smkStyleToEsriSymbol( self.styleFeature() ),
            stylePickFn = function ( type ) { return stylePick[ type ] }

        self.featureSet.addedFeatures( function ( ev ) {
            ev.features.forEach( function ( f ) {
                self.highlight[ f.id ] = SMK.UTIL.geoJsonToEsriGeometry( f, styleHighlightFn ).map( function ( g ) { return new E.Graphic( g ) } )

                self.featureListLayer.addMany( self.highlight[ f.id ] )
            } )
        } )

        self.featureSet.pickedFeature( function ( ev ) {
            if ( ev.feature ) {
                var featureIds = Object.keys( self.highlight )

                self.popupModel.hasMultiple = true
                self.popupCurrentIndex = featureIds.indexOf( ev.feature.id )
                self.popupModel.position = ( self.popupCurrentIndex + 1 ) + ' / ' + featureIds.length
                self.popupFeatureIds = featureIds
            }

            if ( self.picks )
                self.featureListLayer.removeMany( self.picks )

            if ( ev.was ) {
                self.featureListLayer.addMany( self.highlight[ ev.was.id ] )
            }

            if ( ev.feature ) {
                self.picks = self.highlight[ ev.feature.id ].map( function( g ) {
                    return new E.Graphic( {
                        geometry: g.geometry,
                        symbol: stylePickFn( g.geometry.type )
                    } )

                    g.visible = false
                } )
                self.featureListLayer.addMany( self.picks )

                self.featureListLayer.removeMany( self.highlight[ ev.feature.id ] )

                var loc = self.clickLocation ? self.clickLocation.geometry : self.highlight[ ev.feature.id ][ 0 ].geometry
                smk.$viewer.view.goTo( loc ).then( function () {
                    self.showPopup( loc )
                } )
            }

            if ( ev.was && !ev.feature )
                smk.$viewer.hidePopup()
        } )

        self.featureSet.zoomToFeature( function ( ev ) {
            smk.$viewer.view.goTo( self.highlight[ ev.feature.id ] )
        } )

    }

} )
