include.module( 'widgets', [ 
    'vue', 
    'widgets.tool-button-html', 
    'widgets.command-button-html',
    'widgets.toggle-button-html', 
    'widgets.select-option-html', 
    'widgets.enter-input-html',
    'widgets.activate-tool-html' 
], function ( inc ) {
    "use strict";

    var emit = {
        methods: {
            $$emit: function ( event, arg ) {
                this.$root.trigger( this.id, event, arg, this )
            }
        }
    }

    Vue.component( 'command-button', {
        template: inc[ 'widgets.command-button-html' ],
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

    Vue.component( 'toggle-button', {
        template: inc[ 'widgets.toggle-button-html' ],
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

    Vue.component( 'select-option', {
        template: inc[ 'widgets.select-option-html' ],
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

    Vue.component( 'enter-input', {
        template: inc[ 'widgets.enter-input-html' ],
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
        template: inc[ 'widgets.enter-input-html' ],
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
            option:     { type: Object, default: function () { return {} } }
        },
        methods: {
            onChange: function ( val, pos ) {
                this.position = pos; 
                this.$emit( 'change', parseFloat( val ) )
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

    Vue.component( 'activate-tool', {
        extends: emit,
        template: inc[ 'widgets.activate-tool-html' ],
        props: { 
            id:     { type: String },
            title:  { type: String }
        }
    } )

    return {
        emit: emit,

        toolButton: Vue.extend( {
            mixins: [ emit ],
            template: inc[ 'widgets.tool-button-html' ],
            props: { 'id': String, 'type': String, 'title': String, 'visible': Boolean, 'enabled': Boolean, 'active': Boolean, 'icon': String, 'showTitle': Boolean },
            computed: {
                classes: function () {
                    var c = {
                        'smk-tool': true,
                        'smk-tool-active': this.active,
                        'smk-tool-visible': this.visible,
                        'smk-tool-enabled': this.enabled,
                        'smk-tool-title': this.showTitle
                    }
                    c[ 'smk-' + this.id + '-tool' ] = true
                    return c
                }
            },
        } ),

        toolPanel: Vue.extend( {
            mixins: [ emit ],
            props: [ 'id', 'title', 'visible', 'enabled', 'active', 'busy', 'message', 'status', 'expand', 'hasPrevious' ],
        } )

    }

} )