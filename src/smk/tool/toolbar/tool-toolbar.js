include.module( 'tool-toolbar', [ 'tool.tool-js', 'tool-toolbar.toolbar-html' ], function ( inc ) {
    "use strict";
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ToolBarTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this )

        this.model = {
            widgets: []
        }

        // this.toolIds = []
    }

    ToolBarTool.prototype.order = 0

    SMK.TYPE.ToolBarTool = ToolBarTool

    Object.assign( ToolBarTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ToolBarTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat( function ( smk ) {
        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'tool-toolbar.toolbar-html' ] ),
            data: this.model,
            methods: {
                trigger: function ( toolId, event, arg, comp ) {
                    smk.emit( toolId, event, arg, comp )
                }
            }
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ToolBarTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        if ( tool.widget && !tool.parentId ) {          
            this.model.widgets.push( tool.widget )
        }

        // this.toolIds.push( tool.id )

        smk.getSidepanel().addTool( tool, smk )

        return true
    }

    return ToolBarTool
} )

