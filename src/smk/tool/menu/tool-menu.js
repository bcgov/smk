include.module( 'tool-menu', [ 'tool', 'widgets', 'tool-menu.panel-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'menu-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-menu.panel-menu-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets', 'subPanels', 'activeToolId' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function MenuTool( option ) {
        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'subWidgets', [] )
        this.makePropPanel( 'subPanels', {} )
        this.makePropPanel( 'activeToolId', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          null,
            widgetComponent:'menu-widget',
            panelComponent: 'menu-panel',
        }, option ) )
    }

    SMK.TYPE.MenuTool = MenuTool

    $.extend( MenuTool.prototype, SMK.TYPE.Tool.prototype )
    MenuTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            }
        } )

        self.changedActive( function () {
            if ( self.selectedTool )
                self.selectedTool.active = self.active
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.addTool = function ( tool ) {
        var self = this

        this.subWidgets.push( {
            id: tool.id,
            type: tool.type,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )

        Vue.set( this.subPanels, tool.id, {
            panelComponent: tool.panelComponent,
            panel: tool.panel
        } )

        if ( !this.selectedTool )
            this.selectedTool = tool

        tool.changedActive( function () {
            if ( tool.active ) {
                if ( self.selectedTool.id != tool.id ) {
                    var prev = self.selectedTool
                    self.selectedTool = tool
                    prev.active = false
                }
                self.active = true
            }
            else {
                if ( self.selectedTool.id == tool.id && self.active )
                    tool.active = true
            }

            if ( tool.id == self.selectedTool.id )
                self.activeToolId = tool.active ? tool.id : null
        } )
    }

    return MenuTool
} )

