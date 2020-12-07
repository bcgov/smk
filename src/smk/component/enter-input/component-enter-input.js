include.module( 'component-enter-input', [
    'component',
    'component-enter-input.component-enter-input-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'enter-input', {
        template: inc[ 'component-enter-input.component-enter-input-html' ],
        data: function () {
            return {
                position: null
            }
        },
        props: {
            value:      { type: String, default: '' },
            type:       { type: String, default: 'text' },
            placeholder:{ type: String },
            clear:      { type: Boolean, default: true },
            option:     { type: Object, default: function () { return {} } },
            disabled:   { type: Boolean, default: false },
        },
        methods: {
            onChange: function ( val ) {
                this.$emit( 'change', val )
            }
        },
        directives: {
            position: function () {}
        }
    } )

    Vue.component( 'enter-number', {
        template: inc[ 'component-enter-input.component-enter-input-html' ],
        data: function () {
            return {
                type: 'tel',
                position: null
            }
        },
        props: {
            value:      { type: [ Number, String ], default: 0 },
            placeholder:{ type: String },
            clear:      { type: Boolean, default: false },
            option:     { type: Object, default: function () { return {} } },
            disabled:   { type: Boolean, default: false },
        },
        methods: {
            onChange: function ( val, pos ) {
                this.position = pos;
                this.$emit( 'change', parseFloat( val || '0' ) )
            }
        },
        directives: {
            position: function ( el, binding, vnode ) {
                var pos = el.dataset.position
                if ( pos == null ) return

                el.selectionStart = pos
                el.selectionEnd = pos
            }
        }
    } )
} )