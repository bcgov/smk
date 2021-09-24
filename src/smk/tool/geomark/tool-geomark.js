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

            smk.$viewermap.pm.addControls({  
                position: 'topright',  
                drawCircle: false,  
            }); 

            smk.$viewer.map.on('pm:create', function(e) {
                var type = e.layerType,
                    layer = e.layer;

                editableLayers.addLayer(layer);
            });
        }
    )
} )