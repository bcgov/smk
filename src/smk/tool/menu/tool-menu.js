include.module( 'tool-menu', [ 'tool.tool-panel-js', 'tool-menu.panel-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'menu-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-menu.panel-menu-html' ],
        props: [ 'subWidgets', 'subPanels' ],
        methods: {
            isActivePanel: function ( widgetId ) {
                var p = this.getPanel( widgetId )
                if ( p.prop.active ) return true
                while ( p ) {
                    p = this.getChildPanel( p.prop.id )
                    if ( p && p.prop.active ) return true
                }
                return false
            },
            getPanel: function ( id ) {
                return this.subPanels.find( function ( p ) { return p.prop.id == id } )
            },
            getChildPanel: function ( id ) {
                return this.subPanels.find( function ( p ) { return p.prop.parentId == id } )
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function MenuTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'menu-panel', 'menu-widget' )

        this.toolProp( 'subWidgets', { 
            initial: [],
            forWidget: false 
        } )
        this.toolProp( 'subPanels', { 
            initial: [],
            forWidget: false 
        } )

        this.icon = 'menu'
        this.position = 'toolbar'
    }

    SMK.TYPE.MenuTool = MenuTool

    $.extend( MenuTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        smk.on( this.id, {
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
                    smk.$tool[ t.prop.id ].active = false
                } )
            }
        } ) 
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.addTool = function ( tool, smk, setParentId ) {
        var self = this

        if ( !tool.parentId ) {
            setParentId( tool, this.id )
        }

        if ( tool.widget && tool.widget.component ) {
            this.subWidgets.push( tool.widget )

            if ( !this.selectedId )
                this.selectedId = tool.id
        }

        this.subPanels.push( tool.panel )

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

