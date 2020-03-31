include.module( 'tool-location-esri3d', [ 'esri3d', 'types-esri3d', 'tool-location' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    var base = include.option( 'baseUrl' ) + 'images/tool/location'

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

        self.changedActive( function () {
            self.locationLayer.visible = self.active
        } )

        self.pickLocation = function ( location ) {
            var gr = new E.Graphic( {
                geometry:   location.map,
                symbol:     blueMarkerSymbol
            } )

            self.locationLayer.removeAll()
            self.locationLayer.add( gr )
        } 
    } )


} )
