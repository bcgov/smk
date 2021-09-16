include.module( 'tool-geomark', [ 
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
        }
    )
} )