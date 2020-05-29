include.module( 'component-select-option', [ 
    'component',
    'component-select-option.component-select-option-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'select-option', {
        template: inc[ 'component-select-option.component-select-option-html' ],
        props: { 
            options: { type: Array, default: [] },
            value:   {},
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        methods: {
            clickOption: function ( option, index ) {
                this.$emit( 'change', option.value )
            }
        }
    } )
} )