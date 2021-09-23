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
        template: inc[ 'tool-geomark.panel-geomark-html' ],
        props: [ 'build', 'config' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'GeomarkTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'geomark-widget' )
            SMK.TYPE.ToolPanel.call( this, 'geomark-panel' )

            this.defineProp( 'build' )
            this.defineProp( 'config' )
        },
        function ( smk ) {
            this.config = SMK.UTIL.projection( 'lmfId', 'lmfRevision', 'createdBy', '_rev', 'published' )( smk )

            this.config.enabledTools = Object.keys( smk.$toolType ).sort()

            var editableLayers = new L.FeatureGroup();
            smk.$viewer.map.addLayer(editableLayers);

            var drawPluginOptions = {
                position: 'topright',
                draw: {
                    // disable other toolbar shape widgets
                    polyline: false,
                    circle: false, 
                    circlemarker: false,
                    rectangle: false,
                    marker: false
                },
                edit: {
                    featureGroup: editableLayers
                }
            };

            var drawControl = new L.Control.Draw(drawPluginOptions);
            smk.$viewer.map.addControl(drawControl);

            smk.$viewer.map.on('draw:created', function(e) {
                var type = e.layerType,
                    layer = e.layer;

                editableLayers.addLayer(layer);
            });

            var baseUrl = 'https://apps.gov.bc.ca/pub/geomark';
            var client = new window.GeomarkClient(baseUrl);

            smk.on( this.id, {
                'create-geomark': function () {
                    if (editableLayers.getLayers().length == 0) {
                        alert('No drawings were found.');
                        return;
                    }
                    var geoJson = editableLayers.toGeoJSON();
                    // var geoJsonStr = JSON.stringify(geoJson);
                    var lngLatCoords = '';
                    editableLayers.getLayers().forEach(function(layer, index, array) {
                        var latLngs = layer.getLatLngs();
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
                    client.createGeomark({
                        'body': 'SRID=4326;POLYGON(' + lngLatCoords + ')',
                        // 'format': 'geojson',
                        'format': 'wkt',
                        'callback': function(geomarkInfo) {
                            var geomarkId = geomarkInfo.id;
                            if (geomarkId) { 
                                alert('Created geomark: ' + geomarkInfo.url);
                            } else {
                                alert('Error creating geomark: ' + geomarkInfo.error);
                            }
                        }
                    });
                }
            })
        }
    )
} )