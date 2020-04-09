include.module( 'tool-version', [ 'tool.tool-panel-js', 'tool-version.panel-version-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'version-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'version-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-version.panel-version-html' ],
        props: [ 'build', 'config' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function VersionTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'version-panel', 'version-widget' )

        this.toolProp( 'build', { 
            initial: SMK.BUILD,
            forWidget: false 
        } )
        this.toolProp( 'config', { 
            forWidget: false 
        } )

        this.title = 'Version Info'
        this.position = 'list-menu'
        this.order = 99
        this.icon = 'build'
    }

    SMK.TYPE.VersionTool = VersionTool

    $.extend( VersionTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VersionTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        this.config = SMK.UTIL.projection( 'lmfId', 'lmfRevision', 'createdBy', '_rev', 'published' )( smk )

        this.config.enabledTools = Object.keys( smk.$tool ).sort()
    } )

    return VersionTool
} )
