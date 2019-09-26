include.module( 'tool-toolbar', [ 'tool', 'toolbar', 'sidepanel' ], function ( inc ) {
    "use strict";
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ToolBarTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 0
        }, option ) )
    }

    SMK.TYPE.ToolBarTool = ToolBarTool

    $.extend( ToolBarTool.prototype, SMK.TYPE.Tool.prototype )
    ToolBarTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ToolBarTool.prototype.afterInitialize.push( function ( smk ) {
        this.toolbar = smk.$toolbar = new SMK.TYPE.Toolbar( smk )

        this.sidepanel = smk.$sidepanel = new SMK.TYPE.Sidepanel( smk )
        this.sidepanel.changedVisible( function () {
            $( smk.$container ).toggleClass( 'smk-sidebar', smk.$sidepanel.isPanelVisible() )
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ToolBarTool.prototype.addTool = function ( tool ) {
        if ( tool.widgetComponent )
            this.toolbar.add( tool )

        this.sidepanel.addTool( tool )

        return true
    }

    return ToolBarTool
} )

