include.module( 'tool-directions-options', [ 'tool', 'widgets', 'sidepanel', 'tool-directions-options.panel-directions-options-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'directions-options-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-options.panel-directions-options-html' ],
        props: [ 'optimal', 'roundTrip', 'criteria' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsOptionsTool( option ) {
        this.makePropPanel( 'optimal', false )
        this.makePropPanel( 'roundTrip', false )
        this.makePropPanel( 'criteria', 'shortest' )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            title:          'Route Planner Options',
            panelComponent: 'directions-options-panel',
        }, option ) )
    }

    SMK.TYPE.DirectionsOptionsTool = DirectionsOptionsTool

    $.extend( DirectionsOptionsTool.prototype, SMK.TYPE.PanelTool.prototype )
    DirectionsOptionsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsOptionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.changedActive( function () {
            if ( self.active ) {
            }
        } )

        smk.on( this.id, {
            // 'activate': function () {
            //     if ( !self.enabled ) return

            //     self.active = !self.active
            // },

            'change': function ( ev ) {
                Object.assign( self, ev )
            },
        } )
    } )

    return DirectionsOptionsTool
} )

