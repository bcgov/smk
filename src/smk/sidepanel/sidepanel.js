include.module( 'sidepanel', [ 'vue', 'sidepanel.sidepanel-html', 'sidepanel.panel-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'side-panel', {
        template: inc[ 'sidepanel.panel-html' ]
    } )

    function Sidepanel( smk ) {
        this.model = {
            activeToolId: null,
            tool: {}
        }

        var el = smk.addToOverlay( inc[ 'sidepanel.sidepanel-html' ] )

        this.vm = new Vue( {
            el: el,
            data: this.model,
            methods: {
                trigger: function ( toolId, event, arg ) {
                    smk.emit( toolId, event, arg )
                }
            }
    } )

        this.container = $( smk.$container )
    }

    Sidepanel.prototype.setActiveTool = function ( tool ) {
        if ( this.activeTool )
            this.activeTool.active = false

        this.activeTool = tool

        if ( this.activeTool ) {
            this.activeTool.active = true
            if ( this.activeTool.showPanel ) {
                this.model.activeToolId = this.activeTool.id
                this.container.addClass( 'smk-panel-expanded' )
            }
        }
        else {
            this.model.activeToolId = null
            this.container.removeClass( 'smk-panel-expanded' )
        }
    }

    Sidepanel.prototype.add = function ( tool ) {
        var self = this

        if ( tool.showPanel )
            this.vm.$set( this.model.tool, tool.id, {
                panelComponent: tool.panelComponent,
                panel: tool.panel
            } )

        tool.changedActive( function () {
            if ( tool.active )
                self.setActiveTool( tool )
            else
                self.setActiveTool( null )
        } )
    }

    SMK.TYPE.Sidepanel = Sidepanel

    return Sidepanel

} )