include.module( 'tool-directions.tool-directions-options-js', [
    'tool.tool-base-js',
    'tool.tool-panel-js',
    'component-enter-input', 
    'component-select-option',
    'tool-directions.panel-directions-options-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'directions-options-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-directions.panel-directions-options-html' ],
        props: {
            'rangeKm': Number,
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
    return SMK.TYPE.Tool.define( 'DirectionsOptionsTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'directions-options-panel' )

            this.defineProp( 'rangeKm', { validate: positiveInteger } )
            this.defineProp( 'truck' )
            this.defineProp( 'optimal' )
            this.defineProp( 'roundTrip' )
            this.defineProp( 'criteria' )
            this.defineProp( 'truckRoute' )
            this.defineProp( 'truckHeight', { validate: positiveFloat } )
            this.defineProp( 'truckWidth', { validate: positiveFloat } )
            this.defineProp( 'truckLength', { validate: positiveFloat } )
            this.defineProp( 'truckWeight', { validate: positiveFloat } )
            this.defineProp( 'truckHeightUnit' )
            this.defineProp( 'truckWidthUnit' )
            this.defineProp( 'truckLengthUnit' )
            this.defineProp( 'truckWeightUnit' )
            this.defineProp( 'oversize' )
            this.defineProp( 'command' )
            this.defineProp( 'bespoke' )

            this.rangeKm = null
            this.truck = false
            this.optimal = false
            this.roundTrip = false
            this.criteria = 'shortest'
            this.truckRoute = null
            this.truckHeight = null
            this.truckWidth = null
            this.truckLength = null
            this.truckWeight = null
            this.truckHeightUnit = 1
            this.truckWidthUnit = 1
            this.truckLengthUnit = 1
            this.truckWeightUnit = 1
            this.oversize = false
            this.command = {}
            this.bespoke = {}

            this.parentId = 'DirectionsWaypointsTool'

            function positiveFloat( newVal, oldVal ) {
                return positiveNumber(newVal, oldVal, parseFloat(newVal));
            }

            function positiveInteger( newVal, oldVal ) {
                return positiveNumber(newVal, oldVal, parseInt(newVal));
            }

            function positiveNumber(newVal, oldVal, parsedVal) {
                if ( !newVal || !parsedVal ) return null;
                if ( parsedVal < 0 ) return oldVal;
                return parsedVal;
            }
        },
        function ( smk ) {
            var self = this

            var directions = smk.getToolById( this.parentId )

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
        }
    )
} )

