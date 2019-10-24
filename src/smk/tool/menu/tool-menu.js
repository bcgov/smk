include.module( 'tool-menu', [ 'tool', 'widgets', 'tool-menu.panel-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'menu-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-menu.panel-menu-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets', 'activeTool', 'subPanels' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function MenuTool( option ) {
        this.makePropWidget( 'icon', 'menu' )

        this.makePropPanel( 'subWidgets', [] )
        this.makePropPanel( 'subPanels', [] )
        this.makePropPanel( 'activeTool', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          null,
            position:       'toolbar',
            widgetComponent:'menu-widget',
            panelComponent: 'menu-panel',
            container:      true
        }, option ) )

        this.containedId = {}
        this.wereActiveIds = null
        this.hasPrevious = true
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
            }
        } )

        self.changedActive( function () {
            // console.log('menu active',self.active,self.selectedTool && self.selectedTool.id)
            // if ( self.selectedToolId )
                // smk.$tool[ self.selectedToolId ].active = self.active

            if ( self.active ) {
                if ( self.wereActiveIds )
                    self.wereActiveIds.forEach( function ( id ) {
                        console.log( 'activating', id )
                        smk.$tool[ id ].active = true
                    } )
            }
            else {
                self.wereActiveIds = smk.$sidepanel.toolStack.map( function ( t ) { return t.id } )
                console.log( self.wereActiveIds )
            }
        } )

        smk.$sidepanel.changedTool( function ( tool ) {
            if ( tool.id in self.containedId ) {
                self.activeTool = tool
                self.selectedToolId = tool.id

                if ( tool.widgetComponent ) {
                    console.log('menu widget',tool)
                    // self.selectedWidgetId
                }
            }
            else {
                self.activeTool = null
            }
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        // if ( !this.selectedToolId && !tool.subPanel )
            // this.selectedToolId = tool.id

        // tool.subPanel = tool.subPanel + 1

        // smk.getSidepanel().addTool( tool, smk, function () {

        // } )

        if ( tool.widgetComponent ) {
            var w = {
                id: tool.id,
                type: tool.type,
                widgetComponent: tool.widgetComponent,
                widget: tool.widget,
                selected: false
            }

            this.subWidgets.push( w )

            smk.on( tool.id, {
                'activate': function () {
                    console.log('click',tool.id)
                    self.subWidgets.forEach( function ( w ) {
                        w.selected = w.id == tool.id
                        smk.$tool[ w.id ].active = w.selected
                        console.log('selected',w.id,smk.$tool[ w.id ].active)
                    } )
                }
            } )

            // tool.changedActive( function () {
            //     if ( tool.active ) {
            //         self.subWidgets.forEach( function ( t ) {
            //             t.selected = smk.$tool[ t.id ].active = t.id == tool.id
            //         } )
            //     }
            //     else {
                    
            //     }
            // } )
        }

        this.subPanels.push( {
            id:             tool.id,
            // parentId:       tool.parentId,
            type:           tool.type,
            panel:          tool.panel,
            panelComponent: tool.panelComponent,
        } )

        // tool.changedActive( function () {
        //     if ( tool.active ) {
        //         self.subPanels.forEach( function ( t ) {
        //             smk.$tool[ t.id ].active = t.id == tool.id
        //             console.log('active',t.id,smk.$tool[ t.id ].active,t.panel.active)
        //         } )
        //     }
        //     else {
                
        //     }
        // } )

        this.containedId[ tool.id ] = true

        return true
    }

    return MenuTool
} )

