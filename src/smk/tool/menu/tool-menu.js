include.module( 'tool-menu', [
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-panel-js',
    'tool-menu.panel-menu-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'menu-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
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
    return SMK.TYPE.Tool.define( 'MenuTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'menu-widget' )
            SMK.TYPE.ToolPanel.call( this, 'menu-panel' )

            this.defineProp( 'subWidgets' )
            this.defineProp( 'subPanels' )

            this.subWidgets = []
            this.subPanels = []
        },
        function ( smk ) {
            var self = this

            smk.on( this.id, {
                'previous-panel': function ( ev ) {
                    smk.getToolById( self.previousId ).active = true
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
                    smk.getToolById( self.selectedId ).active = true
                }
                else {
                    self.subPanels.forEach( function ( t ) {
                        smk.getToolById( t.prop.id ).active = false
                    } )
                }
            } )
        },
        {
            addTool: function ( tool, smk, setParentId ) {
                var self = this

                if ( !tool.parentId ) {
                    setParentId( tool, this.id )
                }

                if ( tool.makeWidgetComponent ) {          //  && !tool.parentId
                    this.subWidgets.push( tool.makeWidgetComponent() )

                    if ( !this.selectedId )
                        this.selectedId = tool.id
                }

                this.subPanels.push( tool.makePanelComponent() )

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
        }
    )
} )
