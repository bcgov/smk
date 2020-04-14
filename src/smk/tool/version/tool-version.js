include.module( 'tool-version', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-panel-js', 
    'tool-version.panel-version-html' 
], function ( inc ) {
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
    return SMK.TYPE.Tool.define( 'VersionTool', 
        function () {
            SMK.TYPE.ToolWidget.call( this, 'version-widget' )
            SMK.TYPE.ToolPanel.call( this, 'version-panel' )
        
            this.defineProp( 'build' )
            this.defineProp( 'config' )

            this.title = 'Version Info'
            this.position = 'list-menu'
            this.order = 99
            this.icon = 'build'
            this.build = SMK.BUILD
        },
        function ( smk ) {
            this.config = SMK.UTIL.projection( 'lmfId', 'lmfRevision', 'createdBy', '_rev', 'published' )( smk )

            this.config.enabledTools = Object.keys( smk.$tool ).sort()
        }
    )
} )
