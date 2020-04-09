include.module( 'tool-list-menu', [ 'tool.tool-panel-js', 'tool-list-menu.panel-list-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'list-menu-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'list-menu-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-list-menu.panel-list-menu-html' ],
        props: [ 'subWidgets' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ListMenuTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'list-menu-panel', 'list-menu-widget' )

        this.toolProp( 'subWidgets', { 
            initial: [],
            forWidget: false 
        } )

        this.icon = 'menu'
        this.position = 'toolbar'
    }

    SMK.TYPE.ListMenuTool = ListMenuTool

    $.extend( ListMenuTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.addTool = function ( tool, smk, setParentId ) {
        var self = this

        if ( tool.parentId ) {
        }
        else {
            setParentId( tool, this.id )
            this.subWidgets.push( tool.widget )
        }

        smk.getSidepanel().addTool( tool, smk )

        tool.showTitle = true

        return true
    }

    return ListMenuTool
} )

