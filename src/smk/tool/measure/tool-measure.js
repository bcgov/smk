include.module( 'tool-measure', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-panel-js', 
    'tool-measure.panel-measure-html', 
    'component-command-button',
    'component-select-dropdown'
], function ( inc ) {
    "use strict";

    Vue.component( 'measure-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'measure-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-measure.panel-measure-html' ],
        props: [ 'results', 'viewer', 'content' ],
        data: function () {
            return {
                unit: 'metric'
            }
        },
        computed: {
            dimensionalNumber: {
                get: function () {
                    return Vue.filter( 'dimensionalNumber' )
                }
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'MeasureTool', 
        function () {
            SMK.TYPE.ToolWidget.call( this, 'measure-widget' )
            SMK.TYPE.ToolPanel.call( this, 'measure-panel' )
        
            this.defineProp( 'results' )
            this.defineProp( 'viewer' )
            this.defineProp( 'content' )

            this.results = []
            this.viewer = {}

            this.$propFilter.dimensionalNumber = false
        }
    )
} )
