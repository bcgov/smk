include.module( 'tool-bespoke', [ 'tool.tool-panel-js', 'tool-bespoke.panel-bespoke-html', 'vue-config' ], function ( inc ) {
    "use strict";

    Vue.component( 'bespoke-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'bespoke-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-bespoke.panel-bespoke-html' ],
        props: [ 'content', 'component' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BespokeTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'bespoke-panel', 'bespoke-widget' )

        this.toolProp( 'content', { 
            forWidget: false 
        } )
        this.toolProp( 'component', { 
            forWidget: false 
        } )
    }

    SMK.TYPE.BespokeTool = BespokeTool

    $.extend( BespokeTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // BespokeTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    BespokeTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this
        
        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                if ( SMK.HANDLER.has( self.id, 'triggered' ) ) {
                    self.active = false
                    SMK.HANDLER.get( self.id, 'triggered' )( smk, self )
                }
            },

            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )

        if ( !this.component )
            this.content = { 
                create: function ( el ) {
                    SMK.HANDLER.get( self.id, 'activated' )( smk, self, el )
                }
            }

        this.changedActive( function () {
            if ( self.active ) {
                if ( self.component )
                    SMK.HANDLER.get( self.id, 'activated' )( smk, self )
            }
            else {
                SMK.HANDLER.get( self.id, 'deactivated' )( smk, self )
            }
        } )

        SMK.HANDLER.get( self.id, 'initialized' )( smk, self )
    } )

    return BespokeTool
} )
