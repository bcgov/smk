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

        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'currentTool', this.toolStack[ 0 ] )
        this.makePropPanel( 'previousTool', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          'Menu',
            widgetComponent:'list-menu-widget',
            panelComponent: 'list-menu-panel',
        }, option ) )

        this.toolStack[ 0 ].panel.title = this.title
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
            }
        } )

        smk.on( 'close', {
            'activate': function () {
                self.active = false
            }
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                self.active = !self.active
            },
        } )

        self.changedActive( function () {
            if ( self.active ) {
                self.currentTool.active = true
            }
            else {
                self.currentTool.active = false
            }
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
    }

    ListMenuTool.prototype.pushTool = function ( tool ) {
        console.log( 'push', tool.id, this.toolStack.length )

        if ( this.currentTool && this.currentTool.id == tool.id )
            return

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
               
                self.active = true

                // if ( self.currentTool.id != tool.id )
                self.pushTool( tool )
            }
            else {
            }
        } )
    }

    return ListMenuTool
} )

