include.module( 'tool-list-menu', [
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-panel-js',
    'tool-list-menu.panel-list-menu-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'list-menu-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'list-menu-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-list-menu.panel-list-menu-html' ],
        props: [ 'subWidgets' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'ListMenuTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'list-menu-widget' )
            SMK.TYPE.ToolPanel.call( this, 'list-menu-panel' )

            this.defineProp( 'subWidgets' )

            this.subWidgets = []
        },
        function ( smk ) {
            smk.on( this.id, {
                'swipe-up': function ( ev ) {
                    smk.$sidepanel.setExpand( 2 )
                },

                'swipe-down': function ( ev ) {
                    smk.$sidepanel.incrExpand( -1 )
                }
            } )
        },
        {
            addTool: function ( tool, smk, setParentId ) {
                // if ( tool.makeWidgetComponent ) {          //  && !tool.parentId
                //     this.model.widgets.push( tool.makeWidgetComponent() )
                // }
                if ( !tool.parentId ) {
                    setParentId( tool, this.id )
                    this.subWidgets.push( tool.makeWidgetComponent() )
                }

                smk.getSidepanel().addTool( tool, smk )

                tool.showTitle = true

                return true
            }
        }
    )
} )

