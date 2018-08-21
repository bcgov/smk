include.module( 'tool-list-menu', [ 'tool', 'widgets', 'tool-list-menu.panel-list-menu-html', 'tool-list-menu.panel-tool-list-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'list-menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'list-menu-previous-panel', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'list-menu-close', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'list-menu-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-list-menu.panel-list-menu-html' ],
        props: [ 'visible', 'enabled', 'active', 'currentPanel', 'panelTitle', 'previousPanelTitle' ]
    } )

    Vue.component( 'tool-list-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-list-menu.panel-tool-list-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ListMenuTool( option ) {
        this.panelStack = [
            {
                panelComponent: 'tool-list-panel',
                panel: {
                    title: null,
                    subWidgets: []
                }
            }            
        ]

        this.activeTool = null

        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'currentPanel', this.panelStack[ 0 ] )
        this.makePropPanel( 'panelTitle', null )
        this.makePropPanel( 'previousPanelTitle', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          'Menu',
            widgetComponent:'list-menu-widget',
            panelComponent: 'list-menu-panel',
        }, option ) )

        this.panelTitle = this.panelStack[ 0 ].panel.title = this.title
    }

    SMK.TYPE.ListMenuTool = ListMenuTool

    $.extend( ListMenuTool.prototype, SMK.TYPE.Tool.prototype )
    ListMenuTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( 'previous-panel', {
            'activate': function () {
                if ( self.panelStack.length == 1 ) return

                self.panelStack.pop()
                self.currentPanel = self.panelStack[ 0 ]

                if ( self.panelStack.length == 1 ) {
                    self.activeTool.active = false
                    self.activeTool = null
                    self.panelTitle = self.currentPanel.panel.title
                    self.previousPanelTitle = null
                }

            }
        } )

        smk.on( 'close', {
            'activate': function () {
                self.active = false
            }
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },
        } )

        self.changedActive( function () {
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.addTool = function ( tool ) {
        var self = this

        tool.showTitle = true

        this.panelStack[ 0 ].panel.subWidgets.push( {
            id: tool.id,
            type: tool.type,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )

        tool.changedActive( function () {
            console.log( tool.id, tool.active, self.activeTool && self.activeTool.id )
            if ( tool.active ) {
                if ( self.activeTool && self.activeTool.id != tool.id ) {
                    var prev = self.activeTool
                    self.activeTool = tool
                    prev.active = false
                }
                else if ( !self.activeTool ) {
                    self.activeTool = tool
                }

                self.active = true

                self.panelStack.splice( 1 )
                self.panelStack.push( {
                    panelComponent: tool.panelComponent,
                    panel:          Object.assign( {}, tool.panel, { title: null } )
                } )
                self.panelTitle = tool.panel.title
                self.previousPanelTitle = self.panelStack[ self.panelStack.length - 2 ].panel.title 

                self.currentPanel = self.panelStack[ 1 ]
            }
            else {
                if ( self.activeTool &&  self.activeTool.id == tool.id )
                    self.activeTool = null
            }
        } )
    }

    return ListMenuTool
} )

