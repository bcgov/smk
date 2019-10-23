include.module( 'tool-list-menu', [ 'tool', 'widgets', 'tool-list-menu.panel-tool-list-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'list-menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'tool-list-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-list-menu.panel-tool-list-html' ],
        props: [ 'subWidgets' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ListMenuTool( option ) {
        this.makePropWidget( 'icon', 'menu' )
        this.makePropPanel( 'subWidgets', [] )
        
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          'Menu',
            position:       'toolbar',
            widgetComponent:'list-menu-widget',
            panelComponent: 'tool-list-panel',
            currentTool:    null
        }, option ) )
    }

    SMK.TYPE.ListMenuTool = ListMenuTool

    $.extend( ListMenuTool.prototype, SMK.TYPE.Tool.prototype )
    ListMenuTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                self.active = !self.active
            },

            'swipe-up': function ( ev ) {                
                // console.log('swipe up',self)
                self.panel.expand = 1
            },

            'swipe-down': function ( ev ) {
                // console.log('swipe down',self)
                if ( self.panel.expand )
                    self.panel.expand = 0
                else 
                    smk.$sidepanel.closePanel()
            },
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        tool.subPanel = tool.subPanel + 1

        smk.getSidepanel().addTool( tool, smk )

        tool.showTitle = true

        this.subWidgets.push( {
            id: tool.id,
            type: tool.type,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )

        tool.changedActive( function () {
            if ( tool.active ) {              
                if ( !self.active ) {
                    self.active = true
                    tool.active = true // if list-menu isn't active, this is needed
                }
            }
        } )

        return true
    }

    return ListMenuTool
} )

