include.module( 'component-parameter', [ 
    'component',
    'component-parameter.component-parameter-constant-html',
    'component-parameter.component-parameter-input-html', 
    'component-parameter.component-parameter-select-html', 
], function ( inc ) {
    "use strict";

    Vue.component( 'parameter-constant', {
        template: inc[ 'component-parameter.component-parameter-constant-html' ],
        props: [ 'id', 'title', 'value', 'type', 'focus' ],
        mounted: function () {
            this.$emit( 'mounted' )
        }
    } )

    Vue.component( 'parameter-input', {
        template: inc[ 'component-parameter.component-parameter-input-html' ],
        props: [ 'id', 'title', 'value', 'type', 'focus' ],
        data: function () {
            return {
                input: this.value || ''
            }
        },
        watch: {
            value: function ( val ) {
                this.input = val || ''
            },
            focus: function () {
                this.$refs.in.focus()
            }
        },
        mounted: function () {
            this.$emit( 'mounted' )
        }
    } )

    Vue.component( 'parameter-select', {
        template: inc[ 'component-parameter.component-parameter-select-html' ],
        props: [ 'id', 'title', 'choices', 'value', 'type', 'focus', 'useFallback' ],
        data: function () {
            // console.log( 'data', this.value )
            return {
                selected: this.value || ''
            }
        },
        watch: {
            value: function ( val ) {
                // console.log( 'watch', val )
                this.selected = val || ''
            }
        },
        mounted: function () {
            this.$emit( 'mounted' )
        },
        computed: {
            isEmpty: function () {
                return !this.choices || this.choices.length == 0
            }
        }
    } )
} )