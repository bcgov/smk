include.module( 'tool-menu', [ 'tool', 'widgets', 'tool-menu.panel-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'menu-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-menu.panel-menu-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets', 'subPanels' ],
        methods: {
            isActivePanel: function ( widgetId ) {
                var p = this.getPanel( widgetId )
                if ( p.panel.active ) return true
                while ( p ) {
                    p = this.getChildPanel( p.id )
                    if ( p && p.panel.active ) return true
                }
                return false
            },
            getPanel: function ( id ) {
                return this.subPanels.find( function ( p ) { return p.id == id } )
            },
            getChildPanel: function ( id ) {
                return this.subPanels.find( function ( p ) { return p.parentId == id } )
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function MenuTool( option ) {
        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'subWidgets', [] )
        this.makePropPanel( 'subPanels', [] )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          null,
            position:       'toolbar',
            widgetComponent:'menu-widget',
            panelComponent: 'menu-panel',
            container:      true
        }, option ) )

        this.subTool = {}
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
                if ( !self.enabled ) return

                self.active = !self.active
            },

            'previous-panel': function ( ev ) {
                smk.$tool[ self.previousId ].active = true
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
                smk.$tool[ self.selectedId ].active = true
            }
            else {
                self.subPanels.forEach( function ( t ) {
                    smk.$tool[ t.id ].active = false
                } )
            }
        } ) 
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        if ( !tool.parentId ) {
            tool.setParentId( this.id, smk )
        }

        if ( tool.widgetComponent ) {
            this.subWidgets.push( {
                id:                 tool.id,
                widgetComponent:    tool.widgetComponent,
                widget:             tool.widget,
            } )

            if ( !this.selectedId )
                this.selectedId = tool.id
        }

        this.subPanels.push( {
            id:             tool.id,
            panel:          tool.panel,
            panelComponent: tool.panelComponent,
            parentId:       tool.widgetComponent ? null : tool.parentId
        } )

        tool.changedActive( function () {
            // console.log('active!',tool.id,tool.active)
            if ( tool.active ) {
                self.selectedId = tool.id
                self.hasPrevious = !tool.widgetComponent
                self.previousId = tool.parentId
            }
            else {                
            }
        } )

        tool.isToolInGroupActive = function ( toolId ) {
            return toolId == tool.id || toolId == self.id
        }

        return true
    }

    return MenuTool
} )

