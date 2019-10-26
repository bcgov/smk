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
                trigger: function ( toolId, event, arg ) {
                    smk.emit( toolId, event, arg )
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
                selected: false
            } )
        }

        this.toolIds.push( tool.id )

        smk.getSidepanel().addTool( tool, smk )

        tool.changedActive( function () {
            if ( tool.active ) {
                self.toolIds.forEach( function ( id ) {
                    smk.$tool[ id ].active = id == tool.id
                } )
            }
            else {
            }

            self.model.tools.forEach( function ( w ) {
                w.selected = self.toolIds.some( function ( id ) {
                    if ( !smk.$tool[ id ].active ) return false

                    if ( w.id == id ) return true
                    if ( w.id == smk.$tool[ id ].parentId ) return true
                } )
            } )
        } )

        return true
    }

    return ToolBarTool
} )

