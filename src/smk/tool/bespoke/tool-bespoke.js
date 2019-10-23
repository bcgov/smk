include.module( 'tool-bespoke', [ 'tool', 'widgets', 'tool-bespoke.panel-bespoke-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'bespoke-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'bespoke-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-bespoke.panel-bespoke-html' ],
        props: [ 'content', 'showSwipe' ]
    } )

    Vue.directive( 'content', {
        unbind: function ( el, binding ) {
            // console.log( 'unbind', binding )
        },

        inserted: function ( el, binding ) {
            // console.log( 'inserted', binding )

            $( el ).append( binding.value.content )
        },

        update: function ( el, binding ) {
            // console.log( 'update', binding )
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BespokeTool( option ) {
        this.makePropWidget( 'icon', 'extension' ) 

        this.makePropPanel( 'content', null )
        this.makePropPanel( 'showSwipe', false )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            widgetComponent:'bespoke-widget',
            panelComponent: 'bespoke-panel',
            content:        null
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
                // if ( !self.enabled ) return

                self.active = !self.active
            },

            'swipe-up': function ( ev ) {                
                // console.log('swipe up',self)
                self.panel.expand = 1
            },

            'swipe-down': function ( ev ) {
                // console.log('swipe down',self)
                if ( self.panel.expand )
                    self.panel.expand = 0
                else 
                    smk.$sidepanel.closePanel()
            },
        } )

        this.changedActive( function () {
            if ( self.active )
                SMK.HANDLER.get( self.id, 'activated' )( smk, self )
            else
                SMK.HANDLER.get( self.id, 'deactivated' )( smk, self )
        } )

        SMK.HANDLER.get( self.id, 'initialized' )( smk, self )
    } )

    return BespokeTool
} )
