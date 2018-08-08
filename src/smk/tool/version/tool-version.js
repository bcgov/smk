include.module( 'tool-version', [ 'tool', 'widgets', 'tool-version.panel-version-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'version-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'version-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-version.panel-version-html' ],
        props: [ 'build', 'config' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function VersionTool( option ) {
        this.makePropWidget( 'icon', 'build' )
        this.makePropPanel( 'build', SMK.BUILD )
        this.makePropPanel( 'config', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            widgetComponent:'version-widget',
            panelComponent: 'version-panel',
            title:          'SMK Build Info',
            position:       'menu'
        }, option ) )

    }

    SMK.TYPE.versionTool = VersionTool

    $.extend( VersionTool.prototype, SMK.TYPE.Tool.prototype )
    VersionTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VersionTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.config = SMK.UTIL.projection( 'lmfId', 'lmfRevision', 'createdBy', '_rev', 'published' )( smk )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            }
        } )

    } )

    return VersionTool
} )
