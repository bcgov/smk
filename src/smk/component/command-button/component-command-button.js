include.module( 'component-command-button', [ 
    'component',
    'component-command-button.component-command-button-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'command-button', {
        template: inc[ 'component-command-button.component-command-button-html' ],
        props: { 
            title:      { type: String },
            disabled:   { type: Boolean, default: false },
            icon:       { type: String }
        },
        methods: {
            clickButton: function ( ev ) {
                if ( this.disabled ) return
                this.$emit( 'click', ev )
            }
        }
    } )
} )