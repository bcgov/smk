include.module( 'tool-directions-options', [ 'tool', 'widgets', 'sidepanel', 'tool-directions-options.panel-directions-options-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'directions-options-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-options.panel-directions-options-html' ],
        props: {
            'truck' : Boolean, 
            'optimal' : Boolean, 
            'roundTrip' : Boolean, 
            'criteria': String,
            'truckRoute': Number,
            'truckHeight': Number,
            'truckWidth': Number,
            'truckLength': Number,
            'truckWeight': Number,
            'command': Object
        },
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsOptionsTool( option ) {
        this.makePropPanel( 'truck',        false )
        this.makePropPanel( 'optimal',      false )
        this.makePropPanel( 'roundTrip',    false )
        this.makePropPanel( 'criteria',     'shortest' )
        this.makePropPanel( 'truckRoute',   10 )
        this.makePropPanel( 'truckHeight',  null, null, positiveInt )
        this.makePropPanel( 'truckWidth',   null, null, positiveInt )
        this.makePropPanel( 'truckLength',  null, null, positiveInt )
        this.makePropPanel( 'truckWeight',  null, null, positiveInt )
        this.makePropPanel( 'command',      {} )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            title:          'Route Planner Options',
            panelComponent: 'directions-options-panel',
        }, option ) )
    }

    function positiveInt( newVal, oldVal, propName ) {
        var i = parseInt( newVal )
        if ( !newVal || !i ) return null
        if ( i < 0 ) return oldVal
        return i
    }

    SMK.TYPE.DirectionsOptionsTool = DirectionsOptionsTool

    $.extend( DirectionsOptionsTool.prototype, SMK.TYPE.PanelTool.prototype )
    DirectionsOptionsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsOptionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var directions = smk.$tool[ 'directions' ]

        smk.on( this.id, {
            'change': function ( ev, comp ) {
                Object.assign( self, ev )

                comp.$forceUpdate()
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

