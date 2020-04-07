include.module( 'tool-about', [ 'tool.tool-panel-js', 'tool-about.panel-about-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'about-widget', {
        extends: SMK.COMPONENT.ToolWidget,
        // created: function () { console.log( 'created' ) },
        // mounted: function () { console.log( 'mounted' ) },
        // updated: function () { console.log( 'updated' ) },
        // activated: function () { console.log( 'activated' ) },        
    } )

    Vue.component( 'about-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-about.panel-about-html' ],
        props: [ 'content' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function AboutTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'about-panel', 'about-widget' )

        this.toolProp( 'content', { 
            forWidget: false 
        } )
    }

    SMK.TYPE.AboutTool = AboutTool

    Object.assign( AboutTool.prototype, SMK.TYPE.ToolPanel.prototype )

    // AboutTool.prototype.afterInitialize.push( function ( smk ) {
    // } )

    return AboutTool
} )
