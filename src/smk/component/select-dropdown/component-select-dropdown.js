include.module( 'component-select-dropdown', [ 
    'component',
    'component-select-dropdown.component-select-dropdown-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'select-dropdown', {
        template: inc[ 'component-select-dropdown.component-select-dropdown-html' ],
        props: { 
            options: { type: Array, default: [] },
            value:   {},
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        methods: {
            clickOption: function ( value ) {
                this.$emit( 'change', value )
            }
        }
    } )
} )