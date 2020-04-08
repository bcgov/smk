include.module( 'tool-measure', [ 'tool.tool-panel-js', 'tool-measure.panel-measure-html', 'widgets' ], function ( inc ) {
    "use strict";

    Vue.component( 'measure-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'measure-panel', {
        extends: SMK.COMPONENT.ToolPanel,
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

    function MeasureTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'measure-panel', 'measure-widget' )

        this.toolProp( 'results', { 
            initial: [],
            forWidget: false 
        } )
        this.toolProp( 'viewer', { 
            initial: {},
            forWidget: false 
        } )
        this.toolProp( 'content', { 
            forWidget: false 
        } )
    }

    SMK.TYPE.MeasureTool = MeasureTool

    Object.assign( MeasureTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.MeasureTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
    } )

    return MeasureTool
} )

