include.module( 'tool-about', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-panel-js', 
    'tool-about.panel-about-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'about-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'about-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-about.panel-about-html' ],
        props: [ 'content' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'AboutTool', 
        function () {
            SMK.TYPE.ToolWidget.call( this, 'about-widget' )
            SMK.TYPE.ToolPanel.call( this, 'about-panel' )
        
            this.defineProp( 'content' )
        }
    )
} )
