include.module( 'tool-toolbar', [ 'tool', 'tool-toolbar.toolbar-html' ], function ( inc ) {
    "use strict";
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ToolBarTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 0
        }, option ) )

        this.model = {
            tools: []
        }

        this.toolIds = []
    }

    SMK.TYPE.ToolBarTool = ToolBarTool

    $.extend( ToolBarTool.prototype, SMK.TYPE.Tool.prototype )
    ToolBarTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ToolBarTool.prototype.afterInitialize.push( function ( smk ) {
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

        if ( tool.widgetComponent && !tool.parentId ) {          
            this.model.tools.push( {
                id: tool.id,
                type: tool.type,
                widgetComponent: tool.widgetComponent,
                widget: tool.widget,
            } )
        }

        this.toolIds.push( tool.id )
        // console.log( tool.id, smk.getToolGroup( tool.id ), smk.$group )

        smk.getSidepanel().addTool( tool, smk )

        if ( tool.id == tool.rootId ) 
            smk.getToolGroup( tool.id ).forEach( function ( id ) {
                smk.$tool[ id ].changedActive( function () {
                    if ( smk.$tool[ id ].active ) {
                        self.model.tools.forEach( function ( t ) {
                            if ( t.id != smk.$tool[ t.id ].rootId ) return

                            smk.getToolGroup( t.id ).forEach( function ( id1 ) {
                                smk.$tool[ id1 ].active = id == id1
                            } )
                        } )
                    }
                    else {
                    }
                } )
            } )

        return true
    }

    return ToolBarTool
} )

