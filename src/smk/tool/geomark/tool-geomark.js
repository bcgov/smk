include.module( 'tool-geomark', [ 
    'geomark',
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-panel-js',
    'component-alert',
    'component-prompt',
    'tool-geomark.panel-geomark-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'geomark-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } );

    Vue.component( 'geomark-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-geomark.panel-geomark-html' ],
        props: [ 
            'geomarks', 
            'canSave',
            'canClear',
            'showAlert', 
            'showPrompt', 
            'alertBody',
            'promptBody',
            'promptReply',
            'isMobile'
         ]
    } );
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'GeomarkTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'geomark-widget' );
            SMK.TYPE.ToolPanel.call( this, 'geomark-panel' );

            this.defineProp( 'geomarkService' );
            this.defineProp( 'geomarks' );
            this.defineProp( 'canSave' );
            this.defineProp( 'canClear' );
            this.defineProp( 'showAlert');
            this.defineProp( 'showPrompt');
            this.defineProp( 'alertBody' );
            this.defineProp( 'promptBody' );
            this.defineProp( 'isMobile' );

            this.geomarks = [];
            this.canSave = false;
            this.canClear = false;
            this.showAlert = false;
            this.showPrompt = false;
            this.alertBody = '';
            this.promptBody = '';
            this.promptReply = '';
            this.isMobile = false;
        },
        function ( smk ) {
            const self = this;

            if ( smk.$device === 'mobile' ) {
                self.isMobile = true;
                return;
            }

            // Check for "geomarkService" configuration. Example:
            // "geomarkService": {
            //     "url": "https://apps.gov.bc.ca/pub/geomark"
            // }
            if (!self.geomarkService) {
                self.showStatusMessage('No value for "geomarkService" was found in configuration. Geomark tool functionality is disabled.', 'error', 5000);
                return;
            }

            const CUSTOM_COLOUR = '#ee0077';

            this.createCurrentLayerGroupInfo = function() {
                const layerUUID = SMK.UTIL.makeUUID();
                const overlayPane = smk.$viewer.map.getPane('overlayPane');
                smk.$viewer.map.createPane(layerUUID, overlayPane);
                const layerGroup = L.featureGroup(null, {
                    pane: layerUUID
                }).addTo(smk.$viewer.map);
                return { 
                    layerUUID, 
                    layerGroup 
                };
            }

            var currentLayerGroupInfo = self.createCurrentLayerGroupInfo();

            var currentLayer;

            this.buildWktCoords = function(layerGroup) {
                const isMultiPolygon = layerGroup.getLayers().length > 1;
                var wktCoords = isMultiPolygon ? "MULTIPOLYGON(" : "POLYGON(";
                const openCoords = isMultiPolygon ? '((' : '(';
                const closeCoords = isMultiPolygon ? '))' : ')';
                layerGroup.getLayers().forEach(function(layer, layerIndex, layerArray) {
                    layer.getLatLngs().forEach(function(pointArray) {
                        var firstPointStr = '';
                        wktCoords += openCoords;
                        pointArray.forEach(function(point, pointIndex){
                            const lngLatCoord = point.lng + ' ' + point.lat;
                            if (pointIndex == 0) {
                                firstPointStr = lngLatCoord;
                            }
                            wktCoords += lngLatCoord + ', ';
                        });
                        wktCoords += firstPointStr + closeCoords; // close the polygon
                        if (layerIndex !== (layerArray.length - 1)) {
                            wktCoords += ', ';
                        }
                    });
                });
                return wktCoords + ')';
            }

            this.tidyUrl = function(url) {
                url = url.trim();
                if (url.endsWith('/')) {
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
                const lastSlashIndex = geomarkUrl.lastIndexOf('/');
                if (lastSlashIndex > 0) {
                    return geomarkUrl.substring(lastSlashIndex + 1);
                }
            } 

            this.freezeLayer = function(layer) {
                layer.pm.setOptions( {
                    'allowEditing': false,
                    'allowRemoval': false
                } );
            }

            this.addEventLayerToLayerGroup = function(e) {
                const eventLayer = e.layer;
                self.freezeLayer(eventLayer);
                currentLayerGroupInfo.layerGroup.addLayer(eventLayer);
            }

            this.setCanClear = function(e) {
                self.canClear = true;
            }

            this.drawStart = function(e) {
                e.workingLayer.on('pm:vertexadded', self.setCanClear);
                currentLayer = e.workingLayer;
            }

            this.drawEnd = function(e) {
                if (currentLayerGroupInfo.layerGroup.getLayers().length > 0) {
                    self.canSave = true;
                }
                currentLayer.off('pm:vertexadded', self.setCanClear);
            }

            this.toggleMarkupToolbarControls = function() {
                if (smk.$tool.MarkupTool) {
                    smk.$viewer.map.pm.toggleControls();
                }
            }

            this.changedActive( function () {
                if ( self.active ) {
                    smk.$viewer.map.pm.setGlobalOptions({ 
                        templineStyle: { 
                            color: CUSTOM_COLOUR 
                        }, 
                        hintlineStyle: { 
                            color: CUSTOM_COLOUR,
                            fill: false,
                            dashArray: [5, 5] 
                        },
                        pathOptions: {
                            color: CUSTOM_COLOUR
                        } 
                    });
                    smk.$viewer.map.on('pm:drawstart', self.drawStart);
                    smk.$viewer.map.on('pm:drawend', self.drawEnd);
                    smk.$viewer.map.on('pm:create', self.addEventLayerToLayerGroup);
                    self.toggleMarkupToolbarControls();
                    smk.$viewer.map.pm.enableDraw('Polygon', {
                        continueDrawing: true
                    });
                }
                else {
                    smk.$viewer.map.pm.disableDraw();
                    self.toggleMarkupToolbarControls();
                    smk.$viewer.map.off('pm:create', self.addEventLayerToLayerGroup);
                    smk.$viewer.map.off('pm:drawend', self.drawEnd);
                    smk.$viewer.map.off('pm:drawstart', self.drawStart);
                    self.setDefaultDrawStyle();
                }
            } )

            // Override default handling in Identify tool
            smk.$viewer.handlePick( 4, function ( location ) {
                if ( !self.active ) {
                    return;
                }
                return Promise.resolve(true);
            } )

            this.updateAndShowAlert = function(alertBodyArg) {
                self.alertBody = alertBodyArg;
                self.showAlert = true;
            }

            this.toGeomarkInfo = function(geomarkJson, layerUUID) {
                const geomarkProperties = this.getGeomarkProperties(geomarkJson);
                const id = geomarkJson.id || geomarkProperties.id;
                const url = geomarkJson.url || geomarkProperties.url;
                if (id && url) {
                    return {
                        id,
                        url,
                        layerUUID,
                        isVisible: true
                    };
                }
                return undefined;
            }

            this.getGeomarkProperties = function(geomarkJson) {
                // polygon
                if (geomarkJson.properties) {
                    return geomarkJson.properties;
                }
                // multi-polygon
                if (geomarkJson.features && geomarkJson.features[0] && geomarkJson.features[0].properties) {
                    return geomarkJson.features[0].properties;
                } 
                return {};
            }

            this.getGeomarkById = function(geomarkId) {
                return self.geomarks.find(function(item) {
                    return item.id === geomarkId;
                });
            }

            this.loadGeomark = function(promptValue) {
                if (!promptValue || promptValue.length === 0) {
                    return;
                }
                const geomarkUrl = self.tidyUrl(promptValue);
                const geomarkId = self.extractGeomarkId(geomarkUrl);
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
                    success: function(geomarkGeoJson) {
                        const layerUUID = SMK.UTIL.makeUUID();
                        const overlayPane = smk.$viewer.map.getPane('overlayPane');
                        smk.$viewer.map.createPane(layerUUID, overlayPane);
                        const geometryLayer = L.geoJSON(geomarkGeoJson, {
                            style: function (feature) {
                                return {color: CUSTOM_COLOUR};
                            }, 
                            pane: layerUUID
                        });
                        const geomarkInfo = self.toGeomarkInfo(geomarkGeoJson, layerUUID);
                        if (!geomarkInfo) {
                            self.showStatusMessage('Could not load Geomark: expected values not found in response.', 'error', 5000);
                            return;
                        }
                        self.freezeLayer(geometryLayer);
                        geometryLayer.addTo(smk.$viewer.map);
                        self.geomarks.push(geomarkInfo);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.showStatusMessage('Error retrieving geomark from URL ' + geomarkUrl + ': ' + errorThrown, 'error', 5000);
                    }
                });
            }

            const client = new window.GeomarkClient(self.geomarkService.url);

            smk.on( this.id, {
                'clear-drawing': function() {
                    currentLayerGroupInfo.layerGroup.clearLayers();
                    smk.$viewer.map.pm.disableDraw();
                    smk.$viewer.map.pm.enableDraw();
                    self.canSave = false;
                    self.canClear = false;
                },
                'create-geomark': function () {
                    if (currentLayerGroupInfo.layerGroup.getLayers().length == 0) {
                        self.showStatusMessage('No drawings were found. Draw one or more polygons before creating a geomark.', 'warning', 5000);
                        return;
                    }
                    const wktCoords = self.buildWktCoords(currentLayerGroupInfo.layerGroup);
                    client.createGeomark({
                        'body': 'SRID=4326;' + wktCoords,
                        'format': 'wkt',
                        'callback': function(geomarkJson) {
                            const geomarkInfo = self.toGeomarkInfo(geomarkJson, currentLayerGroupInfo.layerUUID);
                            if (geomarkInfo) { 
                                // Layer group must be removed from map before we can reassign its pane, then added back
                                smk.$viewer.map.removeLayer(currentLayerGroupInfo.layerGroup);
                                currentLayerGroupInfo.layerGroup.setStyle({ pane: currentLayerGroupInfo.layerUUID });
                                smk.$viewer.map.addLayer(currentLayerGroupInfo.layerGroup);

                                self.geomarks.push(geomarkInfo);
                                currentLayerGroupInfo = self.createCurrentLayerGroupInfo();
                                self.updateAndShowAlert('Created geomark: <a href="' + geomarkJson.url + 
                                    '" target="_new">' + geomarkJson.url +
                                    '</a>. Save this URL to access your geomark later.');
                                self.canSave = false;
                                self.canClear = false;
                            } else {
                                self.showStatusMessage('Error creating geomark: ' + geomarkJson.error, 'error', 5000);
                            }
                        }
                    });
                },
                'load-geomark': function() {
                    self.promptBody = 'Enter the URL of a geomark to load:';
                    self.showPrompt = true;
                },
                'toggle-geomark': function(idObj) {
                    const geomarkInfo = self.getGeomarkById(idObj.id);
                    if (!(geomarkInfo && smk.$viewer.map.getPane(geomarkInfo.layerUUID))) {
                        return;
                    }
                    if (geomarkInfo.isVisible) {
                        smk.$viewer.map.getPane(geomarkInfo.layerUUID).style.display = 'none';
                    } else {
                        smk.$viewer.map.getPane(geomarkInfo.layerUUID).style.display = 'block'; 
                    }
                    geomarkInfo.isVisible = !geomarkInfo.isVisible;
                },
                'close-alert': function() {
                    self.showAlert = false;
                },
                'cancel-prompt': function() {
                    self.showPrompt = false;
                    self.promptReply = '';
                },
                'close-prompt': function(promptValue) {
                    self.showPrompt = false;
                    self.loadGeomark(promptValue);
                 }
            })
        }
    )
} )