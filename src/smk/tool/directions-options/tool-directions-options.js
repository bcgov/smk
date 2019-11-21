include.module( 'tool-directions-options', [ 'tool', 'widgets', 'sidepanel', 'tool-directions-options.panel-directions-options-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'directions-options-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-options.panel-directions-options-html' ],
        props: [ 
            'truck', 
            'optimal', 
            'roundTrip', 
            'criteria',
            'truckRoute',
            'truckHeight',
            'truckWidth',
            'truckLength',
            'truckWeight',
            'command'
        ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsOptionsTool( option ) {
        this.makePropPanel( 'truck',        false )
        this.makePropPanel( 'optimal',      false )
        this.makePropPanel( 'roundTrip',    false )
        this.makePropPanel( 'criteria',     'shortest' )
        this.makePropPanel( 'truckRoute',   10 )
        this.makePropPanel( 'truckHeight',  null )
        this.makePropPanel( 'truckWidth',   null )
        this.makePropPanel( 'truckLength',  null )
        this.makePropPanel( 'truckWeight',  null )
        this.makePropPanel( 'command',      {} )

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

        var directions = smk.$tool[ 'directions' ]

        // this.changedActive( function () {
        // } )

        smk.on( this.id, {
            'change': function ( ev ) {
                // console.log(ev)
                Object.assign( self, ev )

                directions.findRoute()
            },
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            directions.active = true

            return false
        } )        
    } )

    return DirectionsOptionsTool
} )

