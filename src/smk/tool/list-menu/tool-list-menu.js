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
        props: [ 'visible', 'enabled', 'active', 'currentTool', 'previousTool' ]
    } )

    Vue.component( 'tool-list-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-list-menu.panel-tool-list-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function ListMenuTool( option ) {
        this.toolStack = [
            {
                panelComponent: 'tool-list-panel',
                panel: {
                    title: null,
                    subWidgets: []
                }
            }            
        ]

        // this.activeTool = null

        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'currentTool', this.toolStack[ 0 ] )
        // this.makePropPanel( 'panelTitle', null )
        this.makePropPanel( 'previousTool', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          'Menu',
            widgetComponent:'list-menu-widget',
            panelComponent: 'list-menu-panel',
        }, option ) )

        // this.panelTitle = this.toolStack[ 0 ].hear from panel.title = this.title
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
                self.popTool()
                // if ( self.toolStack.length == 1 ) return

                // self.activeTool.active = false
                // self.toolStack.pop()
                // self.currentTool = self.toolStack[ self.toolStack.length - 1 ]

                // if ( self.toolStack.length == 1 ) {
                //     self.activeTool.active = false
                //     self.activeTool = null
                //     self.panelTitle = self.currentTool.panel.title
                //     self.previousPanelTitle = null
                // }

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
    ListMenuTool.prototype.popTool = function () {
        console.log( 'pop',this.toolStack.length )
        if ( this.toolStack.length == 1 ) return 1

        var top = this.toolStack.length - 1
        
        this.toolStack[ top ].active = false
        this.toolStack.pop()

        this.currentTool = this.toolStack[ top - 1 ]
        this.currentTool.active = true

        this.previousTool = this.toolStack[ top - 2 ]

        return this.toolStack.length
        // self.activeTool.active = false
        // self.toolStack.pop()
        // self.currentTool = self.toolStack[ self.toolStack.length - 1 ]

        // if ( self.toolStack.length == 1 ) {
        //     self.activeTool.active = false
        //     self.activeTool = null
        //     self.panelTitle = self.currentTool.panel.title
        //     self.previousPanelTitle = null
        // }
    }

    ListMenuTool.prototype.pushTool = function ( tool ) {
        console.log( 'push', tool.id, this.toolStack.length )
        if ( tool.widgetComponent )
            while ( this.popTool() > 1 ) {}

        this.currentTool.active = false

        this.toolStack.push( tool )

        this.previousTool = this.currentTool

        this.currentTool = tool
        this.currentTool.active = true
    }

    ListMenuTool.prototype.addTool = function ( tool ) {
        var self = this

        tool.showTitle = true

        this.toolStack[ 0 ].panel.subWidgets.push( {
            id: tool.id,
            type: tool.type,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )

        tool.changedActive( function () {
            console.log( tool.id, tool.active, self.currentTool && self.currentTool.id )
            if ( tool.active ) {
                // if ( self.activeTool && self.activeTool.id != tool.id ) {
                //     var prev = self.activeTool
                //     self.activeTool = tool
                //     prev.active = false
                // }
                // else if ( !self.activeTool ) {
                //     self.activeTool = tool
                // }
                
                self.active = true
                
                if ( self.currentTool.id != tool.id )
                    self.pushTool( tool )
                // if ( tool.widgetComponent )
                //     self.toolStack.splice( 1 )

                // self.toolStack.push( {
                //     panelComponent: tool.panelComponent,
                //     panel:          tool.panel
                // } )
                // self.panelTitle = tool.panel.title
                // // self.toolStack[ self.toolStack.length - 1 ].panel.title = null
                // self.previousPanelTitle = self.toolStack[ self.toolStack.length - 2 ].panel.title 

                // self.currentTool = self.toolStack[ self.toolStack.length - 1 ]
            }
            else {
                // if ( self.activeTool &&  self.activeTool.id == tool.id )
                    // self.activeTool = null
            }
        } )
    }

    return ListMenuTool
} )

