include.module( 'vue-config', [ 'vue', 'vue-config.spinner-gif', 'util' ], function ( inc ) {
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

    Vue.filter( 'formatNumber', function ( value, decimalPlaces, fractionPlaces ) {
        return formatNumber( value, decimalPlaces, fractionPlaces )
    } )

    function formatNumber( value, precision, fractionPlaces ) {
        var rounded = parseFloat( value.toPrecision( precision ) )

        if ( !fractionPlaces )
            return rounded.toLocaleString()

        var i = Math.floor( rounded ),
            f = rounded - i

        return i.toLocaleString() + f.toFixed( fractionPlaces ).substr( 1 )
    }

    Vue.filter( 'formatDate', function ( date ) {
        return formatDate( date )
    } )

    function formatDate( date ) {
        var d = new Date( date )

        return d.toLocaleString()
    }


    Vue.filter( 'formatTime', function ( seconds ) {
        return formatTime( seconds )
    } )

    function formatTime( seconds ) {
        var s = seconds % 60
        var m = Math.trunc( ( seconds - s ) / 60 ) % 60
        var h = Math.trunc( ( seconds - s - 60 * m ) / 60 / 60 )

        if ( h ) 
            return ( '0' + h ).substr( -2 ) + ':' + ( '0' + m ).substr( -2 ) + ':' + ( '0' + s ).substr( -2 ) 

        return ( '0' + m ).substr( -2 ) + ':' + ( '0' + s ).substr( -2 ) 
    }


    Vue.filter( 'dimensionalNumber', function ( value, dim, unit, decimalPlaces ) {
        if ( dim == 1 )
            switch ( unit ) {
                case 'imperial':
                case 'miles':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'mi' ), decimalPlaces ) + ' mi'

                case 'inches':          return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'inches' ), decimalPlaces ) + ' in'
                case 'feet':            return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'ft' ), decimalPlaces ) + ' ft'
                case 'yards':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'yd' ), decimalPlaces ) + ' yd'
                case 'nautical-miles':  return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'nmi' ), decimalPlaces ) + ' nm'
                case 'kilometers':      return formatNumber( value / 1000, decimalPlaces ) + ' km'
                case 'acres':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'mi' ), decimalPlaces ) + ' mi'
                case 'hectares':        return formatNumber( value, decimalPlaces ) + ' m'

                case 'metric': /* jshint -W086 */ // no break before default
                case 'meters': /* jshint -W086 */
                default:                return formatNumber( value, decimalPlaces ) + ' m'
            }

        if ( dim == 2 )
            switch ( unit ) {
                case 'imperial':
                case 'miles':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'mi' ) / SMK.UTIL.getMetersPerUnit( 'mi' ), decimalPlaces ) + ' mi&sup2;'

                case 'inches':          return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'inches' ) / SMK.UTIL.getMetersPerUnit( 'inches' ), decimalPlaces ) + ' in&sup2;'
                case 'feet':            return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'ft' ) / SMK.UTIL.getMetersPerUnit( 'ft' ), decimalPlaces ) + ' ft&sup2;'
                case 'yards':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'yd' ) / SMK.UTIL.getMetersPerUnit( 'yd' ), decimalPlaces ) + ' yd&sup2;'
                case 'nautical-miles':  return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'nmi' ) / SMK.UTIL.getMetersPerUnit( 'nmi' ), decimalPlaces ) + ' nmi&sup2;'
                case 'kilometers':      return formatNumber( value / 1000 / 1000, decimalPlaces ) + ' km&sup2;'
                case 'acres':           return formatNumber( value / SMK.UTIL.getMetersPerUnit( 'GunterChain' ) / SMK.UTIL.getMetersPerUnit( 'Furlong' ), decimalPlaces ) + ' acres'
                case 'hectares':        return formatNumber( value / 100 / 100, decimalPlaces ) + ' ha'

                case 'metric': /* jshint -W086 */
                case 'meters': /* jshint -W086 */
                default:                return formatNumber( value, decimalPlaces ) + ' m&sup2;'
            }

        return formatNumber( value, decimalPlaces )
    } )

    // Vue.mixin( {
    //     methods: {
    //         debug: function ( m, v ) {
    //             console.log( m, v )
    //             return v
    //         }
    //     }
    // } )

    Vue.component( 'busy-spinner', {
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
                imageUrl: inc[ 'vue-config.spinner-gif' ] 
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

    Vue.directive( 'content', {
        bind: function ( el, binding ) {
            binding.value.create( el )
        }
    } )

} )