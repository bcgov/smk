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
    } );

    Vue.component( 'geomark-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-geomark.panel-geomark-html' ],
        props: [ 'geomarks' ]
    } );
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'GeomarkTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'geomark-widget' );
            SMK.TYPE.ToolPanel.call( this, 'geomark-panel' );

            this.defineProp( 'geomarkService' );
            this.defineProp( 'geomarks' );

            this.geomarks = [];
        },
        function ( smk ) {
            var self = this;

            if (!self.geomarkService) {
                self.showStatusMessage('No value for "geomarkService" was found in configuration. Geomark tool functionality is disabled.', 'error', 5000);
                return;
            }

            this.createCurrentDrawingLayer = function() {
                var drawingLayer = new L.FeatureGroup();
                smk.$viewer.map.addLayer(drawingLayer);
                return drawingLayer;
            }

            this.buildLngLatCoords = function(layerGroup) {
                var lngLatCoords = '';
                layerGroup.getLayers().forEach(function(layer, index, array) {
                    layer.getLatLngs().forEach(function(pointArray) {
                        var firstPointStr = '';
                        lngLatCoords += '(';
                        pointArray.forEach(function(point, index) {
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

            var currentDrawingLayer = self.createCurrentDrawingLayer();

            this.toGeomark = function(geomarkInfo, drawingLayer) {
                return {
                    id: geomarkInfo.id,
                    url: geomarkInfo.url,
                    drawingLayer: drawingLayer
                };
            }

            this.getGeomarkById = function(geomarkId) {
                return self.geomarks.find(function(item) {
                    return item.id === geomarkId;
                });
            }

            smk.$viewer.map.on('pm:create', function(e) {
                currentDrawingLayer.addLayer(e.layer);
            });

            var client = new window.GeomarkClient(self.geomarkService.url);

            smk.on( this.id, {
                'create-geomark-from-drawing': function () {
                    if (currentDrawingLayer.getLayers().length == 0) {
                        self.showStatusMessage('No drawings were found. Draw one or more polygons before creating a geomark.', 'warning', 5000);
                        return;
                    }
                    var lngLatCoords = self.buildLngLatCoords(currentDrawingLayer);
                    client.createGeomark({
                        'body': 'SRID=4326;POLYGON(' + lngLatCoords + ')',
                        'format': 'wkt',
                        'callback': function(geomarkInfo) {
                            var geomarkId = geomarkInfo.id;
                            if (geomarkId) { 
                                alert('Created geomark: ' + geomarkInfo.url + 
                                '. Save this URL to access your geomark later.');
                                self.geomarks.push(self.toGeomark(geomarkInfo, currentDrawingLayer));
                                currentDrawingLayer = self.createCurrentDrawingLayer();
                            } else {
                                self.showStatusMessage('Error creating geomark: ' + geomarkInfo.error, 'error', 5000);
                            }
                        }
                    });
                },
                'create-geomark-from-file': function () {
                    alert('Upload your file using the form in the new window. Once you have a Geomark URL, load it using "Load an Existing Geomark".');
                    window.open(self.geomarkService.url + '/geomarks#file');
                },
                'toggle-geomark': function(idObj) {
                    var geomark = self.getGeomarkById(idObj.id);
                    if (!geomark) {
                        return;
                    }
                    if (smk.$viewer.map.hasLayer(geomark.drawingLayer)) {
                        smk.$viewer.map.removeLayer(geomark.drawingLayer);
                    } else {
                        smk.$viewer.map.addLayer(geomark.drawingLayer);
                    }
                }
            })
        }
    )
} )