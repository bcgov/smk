include.module( 'tool-bespoke', [ 'tool', 'widgets', 'tool-bespoke.panel-bespoke-html', 'vue-config' ], function ( inc ) {
    "use strict";

    Vue.component( 'bespoke-widget', {
        extends: inc.widgets.toolButton,
        props: [ 'status' ],
        computed: {
            classes: function () {
                var c = {
                    'smk-tool': true,
                    'smk-tool-active': this.active,
                    'smk-tool-visible': this.visible,
                    'smk-tool-enabled': this.enabled,
                    'smk-tool-title': this.showTitle
                }
                c[ 'smk-' + this.id + '-tool' ] = true

                if ( this.status )
                    c[ 'smk-' + this.status ] = true
                
                return c
            }
        },

    } )

    Vue.component( 'bespoke-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-bespoke.panel-bespoke-html' ],
        props: [ 'content', 'showSwipe', 'component' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BespokeTool( option ) {
        this.makePropWidget( 'icon', 'extension' ) 
        this.makePropWidget( 'status', null ) 

        this.makePropPanel( 'content', null )
        this.makePropPanel( 'component', null )
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

                if ( SMK.HANDLER.has( self.id, 'triggered' ) ) {
                    SMK.HANDLER.get( self.id, 'triggered' )( smk, self )
                }
                else {
                    self.active = !self.active
                }
            },

            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )

        if ( !this.useComponent )
            this.content = { 
                create: function ( el ) {
                    SMK.HANDLER.get( self.id, 'activated' )( smk, self, el )
                }
            }

        this.changedActive( function () {
            if ( self.active ) {
                if ( self.useComponent )
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
