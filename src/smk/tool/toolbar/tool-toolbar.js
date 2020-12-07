include.module( 'tool-toolbar', [ 'tool.tool-js', 'tool-toolbar.toolbar-html' ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'ToolBarTool',
        function () {
            this.model = {
                widgets: []
            }
        },
        function ( smk ) {
            this.vm = new Vue( {
                el: smk.addToOverlay( inc[ 'tool-toolbar.toolbar-html' ] ),
                data: this.model,
                methods: {
                    trigger: function ( toolId, event, arg, comp ) {
                        smk.emit( toolId, event, arg, comp )
                    }
                }
            } )   
        },
        {
            addTool: function ( tool, smk ) {
                var self = this
        
                if ( tool.makeWidgetComponent ) {          //  && !tool.parentId 
                    this.model.widgets.push( tool.makeWidgetComponent() )
                }
        
                smk.getSidepanel().addTool( tool, smk )
        
                return true
            }
        }
    )
} )
