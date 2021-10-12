include.module( 'tool-geomark', [ 
    'geomark',
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-panel-js',
    'tool-geomark.panel-geomark-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'geomark-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'geomark-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-geomark.panel-geomark-html' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'GeomarkTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'geomark-widget' )
            SMK.TYPE.ToolPanel.call( this, 'geomark-panel' )

            this.defineProp( 'geomarkService' )
        },
        function ( smk ) {
            var self = this

            if (!self.geomarkService) {
                self.showStatusMessage('No value for "geomarkService" was found in configuration. Geomark tool functionality is disabled.', 'error', 5000);
                return;
            }

            this.buildLngLatCoords = function(layerGroup) {
                var lngLatCoords = '';
                layerGroup.getLayers().forEach(function(layer, index, array) {
                    layer.getLatLngs().forEach(function(pointArray) {
                        var firstPointStr = '';
                        lngLatCoords += '(';
                        pointArray.forEach(function(point, index, array){
                            var lngLatCoord = point.lng + ' ' + point.lat;
                            if (index == 0) {
                                firstPointStr = lngLatCoord;
                            }
                            lngLatCoords += lngLatCoord + ', ';
                        });
                        lngLatCoords += firstPointStr + ')'; // close the polygon
                        if (index != (array.length - 1)) {
                            lngLatCoords += ', ';
                        }
                    });
                });
                return lngLatCoords;
            }

            this.changedActive( function () {
                if ( self.active ) {
                    smk.$viewer.map.pm.enableDraw('Polygon', {
                        continueDrawing: true
                    });
                }
                else {
                    smk.$viewer.map.pm.disableDraw();
                }
            } )

            var geomarkLayers = new L.FeatureGroup();
            smk.$viewer.map.addLayer(geomarkLayers);

            smk.$viewer.map.on('pm:create', function(e) {
                var type = e.layerType;
                var layer = e.layer;

                geomarkLayers.addLayer(layer);
            });

            var client = new window.GeomarkClient(self.geomarkService.url);

            smk.on( this.id, {
                'create-geomark': function () {
                    if (geomarkLayers.getLayers().length == 0) {
                        self.showStatusMessage('No drawings were found. Draw one or more polygons before creating a geomark.', 'warning');
                        return;
                    }
                    var lngLatCoords = self.buildLngLatCoords(geomarkLayers);
                    client.createGeomark({
                        'body': 'SRID=4326;POLYGON(' + lngLatCoords + ')',
                        'format': 'wkt',
                        'callback': function(geomarkInfo) {
                            var geomarkId = geomarkInfo.id;
                            if (geomarkId) { 
                                alert('Created geomark: ' + geomarkInfo.url + 
                                '. Save this URL to access your geomark later.');
                            } else {
                                self.showStatusMessage('Error creating geomark: ' + geomarkInfo.error, 'error', 5000);
                            }
                        }
                    });
                }
            })
        }
    )
} )