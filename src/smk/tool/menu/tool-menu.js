include.module( 'tool-menu', [ 'tool', 'widgets', 'tool-menu.panel-menu-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'menu-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'menu-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-menu.panel-menu-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets', 'subPanels' ]
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

        this.hasPrevious = false
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
            }
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MenuTool.prototype.addTool = function ( tool, smk ) {
        var self = this

        if ( tool.widgetComponent ) {
            var w = {
                id: tool.id,
                widgetComponent: tool.widgetComponent,
                widget: tool.widget,
                selected: false
            }

            this.subWidgets.push( w )

            smk.on( tool.id, {
                'activate': SMK.UTIL.makeDelayedCall( function () {
                    // console.log('click',tool.id)
                    self.subWidgets.forEach( function ( w ) {
                        w.selected = w.id == tool.id
                        smk.$tool[ w.id ].active = w.selected
                        // console.log('selected',w.id,smk.$tool[ w.id ].panel.active)
                    } )
                }, { delay: 5 } )
            } )
        }

        this.subPanels.push( {
            id:             tool.id,
            panel:          tool.panel,
            panelComponent: tool.panelComponent,
        } )

        tool.changedActive( function () {
            // console.log('active!',tool.id,tool.active)
            if ( tool.active ) {
                self.subPanels.forEach( function ( t ) {
                    smk.$tool[ t.id ].active = t.id == tool.id
                } )

                self.hasPrevious = !!tool.parentId
                self.previousId = tool.parentId
                // console.log('prev?',self.hasPrevious)
            }
            else {                
            }
        } )

        return true
    }

    return MenuTool
} )

