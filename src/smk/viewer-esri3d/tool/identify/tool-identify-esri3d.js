include.module( 'tool-identify-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'tool-identify', 'feature-list-esri3d' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    SMK.TYPE.IdentifyTool.prototype.styleFeature = function ( override ) {
        return Object.assign( {
            strokeColor:    'black',
            strokeWidth:    8,
            strokeOpacity:  0.8,
            fillColor:      'white',
            fillOpacity:    0.5,
        }, this.style, override )
    }


    SMK.TYPE.IdentifyTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.identifyLayer = new E.layers.GraphicsLayer( { visible: false } )
        smk.$viewer.map.add( this.identifyLayer )

        this.identifyPlaceholderLayer = new E.layers.GraphicsLayer( { visible: false } )
        smk.$viewer.map.add( this.identifyPlaceholderLayer )

        this.changedActive( function () {
            self.identifyLayer.visible = self.active
            self.identifyPlaceholderLayer.visible = self.active
        } )

        smk.$viewer.changedPopup( function ( ev ) {
            if ( !self.active ) return

            self.identifyLayer.visible = !smk.$viewer.isPopupVisible()
            self.identifyPlaceholderLayer.visible = smk.$viewer.isPopupVisible()
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            return smk.$viewer.view.hitTest( location.screen )
                .then( function ( hit ) {
                    if ( hit.results.length == 0 ) return
                    if ( !hit.results[ 0 ].graphic ) return
                    if ( !hit.results[ 0 ].graphic.attributes.$identifyMarker ) return

                    smk.$viewer.identified.pick( self.firstId )
                    return true
                } )
        } )

        smk.$viewer.startedIdentify( function ( ev ) {
            self.identifyLayer.removeAll()
            self.identifyPlaceholderLayer.removeAll()

            self.clickLocation = new E.Graphic( {
                geometry: { type: 'point', latitude: ev.location.latitude, longitude: ev.location.longitude },
                attributes: {
                    $identifyMarker: 0
                },
                symbol: {
                    type: 'point-3d',
                    symbolLayers: [
                        {
                            type:       'icon',
                            size:       '10px',
                            anchor:     'center',
                            material: {
                                color: 'white'
                            },
                            resource: {
                                primitive: 'circle'
                            },
                            outline: {
                                size: 1,
                                color: [ 0, 0, 0, 0.2 ]
                            }
                        }
                    ]
                }
            } )

            self.identifyPlaceholderLayer.add( self.clickLocation )
            self.identifyPlaceholderLayer.visible = true
        } )

        smk.$viewer.finishedIdentify( function ( ev ) {
            var stat = smk.$viewer.identified.getStats()

            self.clickLocation.symbol = {
                type: 'point-3d',
                symbolLayers: [
                    {
                        type: 'text',
                        material: {
                            color: 'black'
                        },
                        size: 9,
                        text: stat.featureCount,
                    },
                    {
                        type:       'icon',
                        size:       '30px',
                        anchor:     'center',
                        material: {
                            color: [ 0, 0, 0, 0.2 ]
                        },
                        resource: {
                            primitive: 'circle'
                        },
                    },
                    {
                        type:       'icon',
                        size:       '25px',
                        anchor:     'center',
                        material: {
                            color: 'white'
                        },
                        resource: {
                            primitive: 'circle'
                        },
                    }
                ]
            }
            self.clickLocation.attributes.$identifyMarker = stat.featureCount

            self.identifyLayer.add( self.clickLocation )
        } )

    } )

    SMK.TYPE.IdentifyTool.prototype.afterInitialize.push( inc[ 'feature-list-esri3d' ] )

} )
