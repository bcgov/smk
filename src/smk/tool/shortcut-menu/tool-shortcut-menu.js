include.module( 'tool-shortcut-menu', [ 'tool.tool-js', 'tool-shortcut-menu.shortcut-menu-html' ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'ShortcutMenuTool',
        function () {
            this.model = {
                widgets: []
            }
        },
        function ( smk ) {
            this.vm = new Vue( {
                el: smk.addToStatus( inc[ 'tool-shortcut-menu.shortcut-menu-html' ] ),
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
                smk.getSidepanel().addTool( tool, smk )
        
                this.model.widgets.push( tool.makeWidgetComponent() )
        
                return true
            }        
        }
    )
} )
