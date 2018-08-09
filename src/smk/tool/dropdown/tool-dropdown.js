include.module( 'tool-dropdown', [ 'tool', 'widgets', 'tool-dropdown.panel-dropdown-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'dropdown-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'dropdown-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-dropdown.panel-dropdown-html' ],
        props: [ 'visible', 'enabled', 'active', 'subWidgets', 'subPanels', 'activeToolId' ],
        methods: {
            removeTitle: function ( prop ) {
                prop.title = null
                return prop
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DropdownTool( option ) {
        this.makePropWidget( 'icon', 'arrow_drop_down_circle' )

        this.makePropPanel( 'subWidgets', [] )
        this.makePropPanel( 'subPanels', {} )
        this.makePropPanel( 'activeToolId', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:          null,
            widgetComponent:'dropdown-widget',
            panelComponent: 'dropdown-panel',
        }, option ) )
    }

    SMK.TYPE.DropdownTool = DropdownTool

    $.extend( DropdownTool.prototype, SMK.TYPE.Tool.prototype )
    DropdownTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DropdownTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            'select-tool': function ( ev ) {
                smk.$tool[ ev.id ].active = true
            }
        } )

        self.changedActive( function () {
            if ( self.selectedTool )
                self.selectedTool.active = self.active
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DropdownTool.prototype.addTool = function ( tool ) {
        var self = this

        this.subWidgets.push( {
            id: tool.id,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )

        Vue.set( this.subPanels, tool.id, {
            panelComponent: tool.panelComponent,
            panel: tool.panel
        } )

        if ( !this.selectedTool )
            this.selectedTool = tool

        tool.changedActive( function () {
            if ( tool.active ) {
                if ( self.selectedTool.id != tool.id ) {
                    var prev = self.selectedTool
                    self.selectedTool = tool
                    prev.active = false
                }
                self.active = true
            }
            else {
                if ( self.selectedTool.id == tool.id && self.active )
                    tool.active = true
            }

            if ( tool.id == self.selectedTool.id )
                self.activeToolId = tool.active ? tool.id : null
        } )
    }

    return DropdownTool
} )

