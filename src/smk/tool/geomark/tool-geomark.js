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

            // Check for "geomarkService" configuration. Example:
            // "geomarkService": {
            //     "url": "https://apps.gov.bc.ca/pub/geomark"
            // }
            if (!self.geomarkService) {
                self.showStatusMessage('No value for "geomarkService" was found in configuration. Geomark tool functionality is disabled.', 'error', 5000);
                return;
            }

            this.createCurrentDrawingLayer = function() {
                var drawingLayer = new L.FeatureGroup();
                smk.$viewer.map.addLayer(drawingLayer);
                return drawingLayer;
            }

            this.buildWktCoords = function(layerGroup) {
                var isMultiPolygon = layerGroup.getLayers().length > 1;
                var wktCoords = isMultiPolygon ? "MULTIPOLYGON(" : "POLYGON(";
                var openCoords = isMultiPolygon ? '((' : '(';
                var closeCoords = isMultiPolygon ? '))' : ')';
                layerGroup.getLayers().forEach(function(layer, layerIndex, layerArray) {
                    layer.getLatLngs().forEach(function(pointArray) {
                        var firstPointStr = '';
                        wktCoords += openCoords;
                        pointArray.forEach(function(point, pointIndex){
                            var lngLatCoord = point.lng + ' ' + point.lat;
                            if (pointIndex == 0) {
                                firstPointStr = lngLatCoord;
                            }
                            wktCoords += lngLatCoord + ', ';
                        });
                        wktCoords += firstPointStr + closeCoords; // close the polygon
                        if (layerIndex != (layerArray.length - 1)) {
                            wktCoords += ', ';
                        }
                    });
                });
                return wktCoords + ')';
            }

            this.tidyUrl = function(url) {
                url = url.trim();
                if (url.endsWith('/') && url.length > 0) {
                    url = url.substring(0, (url.length - 1));
                }
                url = url.split('?')[0];
                url = encodeURI(url);
                return url;
            }

            this.extractGeomarkId = function(geomarkUrl){
                if (!geomarkUrl) {
                    return;
                }
                var lastSlashIndex = geomarkUrl.lastIndexOf('/');
                if (lastSlashIndex > 0) {
                    return geomarkUrl.substring(lastSlashIndex + 1);
                }
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
                    id: geomarkInfo.id || geomarkInfo.properties.id,
                    url: geomarkInfo.url || geomarkInfo.properties.url,
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
                'create-geomark': function () {
                    if (currentDrawingLayer.getLayers().length == 0) {
                        self.showStatusMessage('No drawings were found. Draw one or more polygons before creating a geomark.', 'warning', 5000);
                        return;
                    }
                    var wktCoords = self.buildWktCoords(currentDrawingLayer);
                    client.createGeomark({
                        'body': 'SRID=4326;' + wktCoords,
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
                'load-geomark': function() {
                    var enteredUrl = prompt('Enter the URL of a geomark to load:');
                    var geomarkUrl = self.tidyUrl(enteredUrl);
                    var geomarkId = self.extractGeomarkId(geomarkUrl);
                    if (!geomarkId) {
                        self.showStatusMessage('Could not discern a geomark ID within "' + geomarkUrl + '"', 'warning', 5000);
                        return;
                    }
                    if (self.getGeomarkById(geomarkId)) {
                        self.showStatusMessage('Geomark ' + geomarkId + ' is already loaded.', 'warning', 5000);
                        return;
                    }
                    $.ajax({
                        url: geomarkUrl + '/feature.geojson',
                        dataType: 'json',
                        traditional: true,
                        success: function(geomarkFeature) {
                            var geometryLayer = L.geoJSON(geomarkFeature.geometry).addTo(smk.$viewer.map);
                            self.geomarks.push(self.toGeomark(geomarkFeature, geometryLayer));
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.showStatusMessage('Error retrieving geomark from URL ' + geomarkUrl + ': ' + errorThrown, 'error', 5000);
                        }
                    });
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