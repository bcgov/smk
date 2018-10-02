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
            self.visible = self.active
        } )

        self.changedVisible( function () {
            self.featureListLayer.visible = self.visible
        } )

        this.changedActive( function () {
            if ( self.active ) {
                self.featureListLayer.visible = true
            }
            else {
                self.featureListLayer.visible = false
            }
        } )

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
            if ( self.picks )
                self.featureListLayer.removeMany( self.picks )

            if ( ev.was ) {
                self.featureListLayer.addMany( self.highlight[ ev.was.id ] )
            }

            if ( ev.feature ) {
                self.picks = self.highlight[ ev.feature.id ].map( function( g ) {
                    g.visible = false

                    return new E.Graphic( {
                        geometry: g.geometry,
                        symbol: stylePickFn( g.geometry.type )
                    } )
                } )
                self.featureListLayer.addMany( self.picks )

                self.featureListLayer.removeMany( self.highlight[ ev.feature.id ] )

                var loc = self.clickLocation ? self.clickLocation.geometry : self.highlight[ ev.feature.id ][ 0 ].geometry
                smk.$viewer.view.goTo( loc ) 
            }
        } )

        self.featureSet.zoomToFeature( function ( ev ) {
            smk.$viewer.view.goTo( self.highlight[ ev.feature.id ] )
        } )

    }

} )
