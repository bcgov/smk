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

        this.toolIds = []
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
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )

        this.changedActive( function () {
            if ( self.active ) {
                self.toolIds.forEach( function ( id ) {
                    smk.$tool[ id ].active = false
                } )
            }
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ListMenuTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        if ( !tool.parentId ) {
            tool.setParentId( this.id )
            // tool.hasPrevious = true
        }

        smk.getSidepanel().addTool( tool, smk )

        tool.showTitle = true

        if ( tool.widgetComponent )
            this.subWidgets.push( {
                id: tool.id,
                type: tool.type,
                widgetComponent: tool.widgetComponent,
                widget: tool.widget
            } )

        this.toolIds.push( tool.id )

        tool.changedActive( function () {
            if ( tool.active ) {
                self.active = false
                self.toolIds.forEach( function ( id ) {
                    smk.$tool[ id ].active = id == tool.id
                } )
            }
        } )

        return true
    }

    return ListMenuTool
} )

