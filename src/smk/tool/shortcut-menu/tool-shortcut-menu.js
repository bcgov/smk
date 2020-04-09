include.module( 'tool-shortcut-menu', [ 'tool.tool-js', 'tool-shortcut-menu.shortcut-menu-html' ], function ( inc ) {
    "use strict";

    function ShortcutMenuTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )

        this.model = {
            widgets: []
        }
    }

    SMK.TYPE.ShortcutMenuTool = ShortcutMenuTool

    Object.assign( ShortcutMenuTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.ShortcutMenuTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat( function ( smk ) {
        this.vm = new Vue( {
            el: smk.addToStatus( inc[ 'tool-shortcut-menu.shortcut-menu-html' ] ),
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
    ShortcutMenuTool.prototype.addTool = function ( tool, smk ) {
        smk.getSidepanel().addTool( tool, smk )

        this.model.widgets.push( tool.widget )

        return true
    }

    return ShortcutMenuTool
} )

