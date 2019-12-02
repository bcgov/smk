include.module( 'tool-bespoke', [ 'tool', 'widgets', 'tool-bespoke.panel-bespoke-html', 'vue-config' ], function ( inc ) {
    "use strict";

    Vue.component( 'bespoke-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'bespoke-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-bespoke.panel-bespoke-html' ],
        props: [ 'content', 'showSwipe' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BespokeTool( option ) {
        this.makePropWidget( 'icon', 'extension' ) 

        this.makePropPanel( 'content', {} )
        this.makePropPanel( 'showSwipe', false )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            widgetComponent:'bespoke-widget',
            panelComponent: 'bespoke-panel'
        }, option ) )
    }

    SMK.TYPE.BespokeTool = BespokeTool

    $.extend( BespokeTool.prototype, SMK.TYPE.Tool.prototype )
    BespokeTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    BespokeTool.prototype.afterInitialize.push( function ( smk ) {
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

        this.content.create = function ( el ) {
            SMK.HANDLER.get( self.id, 'activated' )( smk, self, el )
        }

        this.changedActive( function () {
            if ( !self.active )
                SMK.HANDLER.get( self.id, 'deactivated' )( smk, self )
        } )

        SMK.HANDLER.get( self.id, 'initialized' )( smk, self )
    } )

    return BespokeTool
} )
