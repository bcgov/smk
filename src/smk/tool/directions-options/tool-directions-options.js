include.module( 'tool-directions-options', [ 
    'tool.tool-panel-js', 
    'tool-directions-options.panel-directions-options-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'directions-options-panel', {
        extends: SMK.COMPONENT.ToolPanel,
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
    function DirectionsOptionsTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'directions-options-panel' )

        this.toolProp( 'truck', {
            initial: false,
            forWidget: false
        } )
        this.toolProp( 'optimal', {
            initial: false,
            forWidget: false
        } )
        this.toolProp( 'roundTrip', {
            initial: false,
            forWidget: false
        } )
        this.toolProp( 'criteria', {
            initial: 'shortest',
            forWidget: false
        } )
        this.toolProp( 'truckRoute', {
            initial: null,
            forWidget: false
        } )
        this.toolProp( 'truckHeight', {
            initial: null,
            validate: positiveFloat,
            forWidget: false
        } )
        this.toolProp( 'truckWidth', {
            initial: null,
            validate: positiveFloat,
            forWidget: false
        } )
        this.toolProp( 'truckLength', {
            initial: null,
            validate: positiveFloat,
            forWidget: false
        } )
        this.toolProp( 'truckWeight', {
            initial: null,
            validate: positiveFloat,
            forWidget: false
        } )
        this.toolProp( 'truckHeightUnit', {
            initial: 1,
            forWidget: false
        } )
        this.toolProp( 'truckWidthUnit', {
            initial: 1,
            forWidget: false
        } )
        this.toolProp( 'truckLengthUnit', {
            initial: 1,
            forWidget: false
        } )
        this.toolProp( 'truckWeightUnit', {
            initial: 1,
            forWidget: false
        } )
        this.toolProp( 'oversize', {
            initial: false,
            forWidget: false
        } )
        this.toolProp( 'command', {
            initial: {},
            forWidget: false
        } )
        this.toolProp( 'bespoke', {
            initial: {},
            forWidget: false
        } )

        function positiveFloat( newVal, oldVal, propName ) {
            var i = parseFloat( newVal )
            if ( !newVal || !i ) return null
            if ( i < 0 ) return oldVal
            return i
        }
    }

    SMK.TYPE.DirectionsOptionsTool = DirectionsOptionsTool

    $.extend( DirectionsOptionsTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsOptionsTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
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

