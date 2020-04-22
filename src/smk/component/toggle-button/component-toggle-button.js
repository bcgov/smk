include.module( 'component-toggle-button', [ 
    'component',
    'component-toggle-button.component-toggle-button-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'toggle-button', {
        template: inc[ 'component-toggle-button.component-toggle-button-html' ],
        props: { 
            value:      { type: Boolean, default: false },
            iconOff:    { type: String, default: 'toggle_off' },
            iconOn:     { type: String, default: 'toggle_on' },
            titleOff:   { type: String, default: 'Off. Click to turn on' },
            titleOn:    { type: String, default: 'On. Click to turn off' },
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        methods: {
            clickToggle: function () {
                this.$emit( 'change', !this.value )
            }
        }
    } )
} )