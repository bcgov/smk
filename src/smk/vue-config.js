include.module( 'vue-config', [ 'vue' ], function ( inc ) {
    "use strict";

    Vue.filter( 'formatTitle', function ( value ) {
        return formatTitle( value )
    } )

    function formatTitle( value ) {
        if ( value == null ) return '(Null)'

        return value
            // surround symbols with spaces
            .replace( /([^\w\s]+)/, ' $1 ' )
            // surround words starting with cap with spaces 
            .replace( /\s*[A-Z]\S*?\w(?=\W)/g, function ( m ) { return ' ' + m.trim() + ' ' } )
            // change _ & - to space
            .replace( /\s*[_-]\s*/g, ' ' )
            .toLowerCase()
            // uppercase first letter of each space-separated word
            .replace( /^\w|\s\w/g, function ( m ) { return m.toUpperCase() } )
            // collapse whitespace to single space
            .replace( /\s+/g, ' ' )
            .trim()
    }

    Vue.filter( 'formatNumber', function ( value, decimalPlaces ) {
        return formatNumber( value, decimalPlaces )
    } )

    function formatNumber( value, decimalPlaces ) {
        var i = Math.floor( value ),
            f = value - i

        return i.toLocaleString() + ( decimalPlaces && decimalPlaces > 0 ? f.toFixed( decimalPlaces ).substr( 1 ) : '' )
    }

    Vue.filter( 'formatDate', function ( date ) {
        return formatDate( date )
    } )

    function formatDate( date ) {
        var d = new Date( date )

        return d.toLocaleString()
    }

    Vue.filter( 'dimensionalNumber', function ( value, dim, unit, decimalPlaces ) {
        if ( dim == 1 )
            switch ( unit ) {
                case 'imperial':
                case 'miles':           return formatNumber( value / metersPerUnit[ 'mi' ], decimalPlaces ) + ' mi'

                case 'inches':          return formatNumber( value / metersPerUnit[ 'inches' ], decimalPlaces ) + ' in'
                case 'feet':            return formatNumber( value / metersPerUnit[ 'ft' ], decimalPlaces ) + ' ft'
                case 'yards':           return formatNumber( value / metersPerUnit[ 'yd' ], decimalPlaces ) + ' yd'
                case 'nautical-miles':  return formatNumber( value / metersPerUnit[ 'nmi' ], decimalPlaces ) + ' nm'
                case 'kilometers':      return formatNumber( value / 1000, decimalPlaces ) + ' km'
                case 'acres':           return formatNumber( value / metersPerUnit[ 'mi' ], decimalPlaces ) + ' mi'
                case 'hectares':        return formatNumber( value, decimalPlaces ) + ' m'

                case 'metric': /* jshint -W086 */ // no break before default
                case 'meters': /* jshint -W086 */
                default:                return formatNumber( value, decimalPlaces ) + ' m'
            }

        if ( dim == 2 )
            switch ( unit ) {
                case 'imperial':
                case 'miles':           return formatNumber( value / metersPerUnit[ 'mi' ] / metersPerUnit[ 'mi' ], decimalPlaces ) + ' mi²'

                case 'inches':          return formatNumber( value / metersPerUnit[ 'inches' ] / metersPerUnit[ 'inches' ], decimalPlaces ) + ' in²'
                case 'feet':            return formatNumber( value / metersPerUnit[ 'ft' ] / metersPerUnit[ 'ft' ], decimalPlaces ) + ' ft²'
                case 'yards':           return formatNumber( value / metersPerUnit[ 'yd' ] / metersPerUnit[ 'yd' ], decimalPlaces ) + ' yd²'
                case 'nautical-miles':  return formatNumber( value / metersPerUnit[ 'nmi' ] / metersPerUnit[ 'nmi' ], decimalPlaces ) + ' nmi²'
                case 'kilometers':      return formatNumber( value / 1000 / 1000, decimalPlaces ) + ' km²'
                case 'acres':           return formatNumber( value / metersPerUnit[ 'GunterChain' ] / metersPerUnit[ 'Furlong' ], decimalPlaces ) + ' acres'
                case 'hectares':        return formatNumber( value / 100 / 100, decimalPlaces ) + ' ha'

                case 'metric': /* jshint -W086 */
                case 'meters': /* jshint -W086 */
                default:                return formatNumber( value, decimalPlaces ) + ' m²'
            }

        return formatNumber( value, decimalPlaces )
    } )

    var metersPerUnit = {
        "Mil":              2.5399999999999996e-8,
        "MicroInch":        0.0000254,
        "mm":               0.001,
        "Millimeter":       0.001,
        "cm":               0.01,
        "Centimeter":       0.01,
        "IInch":            0.0254,
        "us-in":            0.0254000508001016,
        "Inch":             0.0254000508001016,
        "in":               0.0254000508001016,
        "inches":           0.0254000508001016,
        "Decimeter":        0.1,
        "ClarkeLink":       0.201166194976,
        "SearsLink":        0.2011676512155,
        "BenoitLink":       0.20116782494375873,
        "IntnlLink":        0.201168,
        "link":             0.201168,
        "GunterLink":       0.2011684023368047,
        "CapeFoot":         0.3047972615,
        "ClarkeFoot":       0.3047972651151,
        "ind-ft":           0.30479841,
        "IndianFt37":       0.30479841,
        "SearsFoot":        0.30479947153867626,
        "IndianFt75":       0.3047995,
        "IndianFoot":       0.30479951,
        "IndianFt62":       0.3047996,
        "GoldCoastFoot":    0.3047997101815088,
        "IFoot":            0.3048,
        "Foot":             0.3048006096012192,
        "ft":               0.3048006096012192,
        "us-ft":            0.3048006096012192,
        "ModAmFt":          0.304812252984506,
        "ind-yd":           0.9143952300000001,
        "IndianYd37":       0.9143952300000001,
        "SearsYard":        0.914398414616029,
        "IndianYd75":       0.9143985000000001,
        "IndianYard":       0.9143985307444409,
        "IndianYd62":       0.9143987999999998,
        "IYard":            0.9143999999999999,
        "Yard":             0.9144018288036576,
        "yd":               0.9144018288036576,
        "us-yd":            0.9144018288036576,
        "CaGrid":           0.9997380000000001,
        "m":                1,
        "Meter":            1,
        "GermanMeter":      1.0000135965,
        "fath":             1.8287999999999998,
        "Fathom":           1.8287999999999998,
        "Rood":             3.7782668980000005,
        "Perch":            5.02921005842012,
        "Rod":              5.02921005842012,
        "Pole":             5.02921005842012,
        "Dekameter":        10,
        "Decameter":        10,
        "ClarkeChain":      20.1166194976,
        "ind-ch":           20.11669506,
        "SearsChain":       20.11676512155,
        "BenoitChain":      20.116782494375872,
        "IntnlChain":       20.1168,
        "ch":               20.1168,
        "us-ch":            20.11684023368047,
        "GunterChain":      20.11684023368047,
        "dm":               100,
        "Hectometer":       100,
        "Furlong":          201.1684023368046,
        "Brealey":          375,
        "km":               1000,
        "Kilometer":        1000,
        "IMile":            1609.344,
        "Mile":             1609.3472186944373,
        "mi":               1609.3472186944373,
        "us-mi":            1609.3472186944373,
        "kmi":              1851.9999999999998,
        "nmi":              1851.9999999999998,
        "NautM":            1852.0000000000002,
        "NautM-UK":         1853.1840000000002,
        "50kilometers":     50000,
        "Lat-66":           110943.31648893275,
        "Lat-83":           110946.25736872235,
        "dd":               111118.97383794768,
        "degrees":          111118.97383794768,
        "150kilometers":    150000
    }

    // Vue.mixin( {
    //     methods: {
    //         debug: function ( m, v ) {
    //             console.log( m, v )
    //             return v
    //         }
    //     }
    // } )

    Vue.component( 'spinner', {
        template: '\
<img class="smk-spinner"\
    v-if="busy"\
    v-bind:src="imageUrl"\
    v-bind:style="{ width: size + \'px\', height: size + \'px\' }"\
>',
        props: {
            size: {
                type: Number,
                default: 24
            },
            busy: Boolean
        },
        data: function () {
            return {
                imageUrl: include.option( 'baseUrl' ) + '/images/spinner.gif'
            }
        }
    } )

    Vue.component( 'status-message', {
        template: '<div class="smk-message" v-bind:class="\'smk-\' + status"><span v-html="message"></span></div>',
        props: {
            status: {
                type: String,
                default: 'summary'
            },
            message: {
                type: String,
                default: ''
            }
        }
    } )

} )