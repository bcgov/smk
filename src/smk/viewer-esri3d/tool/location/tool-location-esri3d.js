include.module( 'tool-location-esri3d', [ 'esri3d', 'types-esri3d', 'tool-location' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    var base = include.option( 'baseUrl' ) + '/images/tool/location'

    var blueMarkerSymbol = {
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
                    href:   base + '/marker-icon-blue.png',
                }
            }
        ]
    }

    SMK.TYPE.LocationTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.locationLayer = new E.layers.GraphicsLayer( { visible: false } )
        smk.$viewer.map.add( self.locationLayer )

        this.updatePopup = function () {
            var gr = new E.Graphic( {
                geometry:   this.location.map,
                symbol:     blueMarkerSymbol
            } )

            self.locationLayer.removeAll()
            self.locationLayer.add( gr )

            smk.$viewer.showPopup( self.vm.$el, this.location.map, { title: 'Location' } )
        }

        smk.$viewer.changedPopup( function () {
            if ( !smk.$viewer.isPopupVisible() )
                self.visible = false
        } )

        self.changedVisible( function () {
            if ( self.visible ) {
                self.locationLayer.visible = true
            }
            else {
                smk.$viewer.view.popup.close()
                self.locationLayer.visible = false
            }
        } )
    } )


} )
