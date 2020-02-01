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
            'truckHeightUnit': Number,
            'truckWidthUnit': Number,
            'truckLengthUnit': Number,
            'truckWeightUnit': Number,
            'oversize' : Boolean, 
            'command': Object,
            'bespoke': Object
        },
        methods: {
            fromUnit: function ( val, unit ) {
                return ( val * unit )
            },
            toUnit: function ( val, unit ) {
                return ( val / unit )
            },

            formatNumber: function ( value, fractionPlaces ) {
                var i = Math.floor( value ),
                    f = value - i

                return i.toString() + f.toFixed( fractionPlaces ).substr( 1 )
            }
        }
    } )

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsOptionsTool( option ) {
        this.makePropPanel( 'truck',        false )
        this.makePropPanel( 'optimal',      false )
        this.makePropPanel( 'roundTrip',    false )
        this.makePropPanel( 'criteria',     'shortest' )
        this.makePropPanel( 'truckRoute',   10 )
        this.makePropPanel( 'truckHeight',  null, null, positiveFloat )
        this.makePropPanel( 'truckWidth',   null, null, positiveFloat )
        this.makePropPanel( 'truckLength',  null, null, positiveFloat )
        this.makePropPanel( 'truckWeight',  null, null, positiveFloat )
        this.makePropPanel( 'truckHeightUnit',  1 )
        this.makePropPanel( 'truckWidthUnit',   1 )
        this.makePropPanel( 'truckLengthUnit',  1 )
        this.makePropPanel( 'truckWeightUnit',  1 )
        this.makePropPanel( 'oversize',    false )
        this.makePropPanel( 'command',      {} )
        this.makePropPanel( 'bespoke',      {} )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            title:          'Route Planner Options',
            panelComponent: 'directions-options-panel',
        }, option ) )
    }

    function positiveFloat( newVal, oldVal, propName ) {
        var i = parseFloat( newVal )
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

        var findRouteDelayed = SMK.UTIL.makeDelayedCall( function () {
            directions.findRoute()
        } )

        smk.on( this.id, {
            'change': function ( ev, comp ) {
                Object.assign( self, ev )

                comp.$forceUpdate()
                findRouteDelayed()
                // directions.findRoute()
            },
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            directions.active = true

            return false
        } )        

        this.bespoke.create = function ( el ) {
            SMK.HANDLER.get( self.id, 'activated' )( smk, self, el )
        }
    } )

    return DirectionsOptionsTool
} )

