include.module( 'component', [
    'component.format-link-html',
    'component.tool-widget-html'
], function ( inc ) {
    "use strict";

    SMK.COMPONENT.FeatureBase = { //Vue.extend( {
        props: [ 'feature', 'layer', 'showHeader', 'attributes' ],
        methods: {
            insertWordBreaks: function ( str ) {
                return str.replace( /[^a-z0-9 ]+/ig, function ( m ) { return '<wbr>' + m } )
            },
            formatValue: function ( val ) {
                if ( /^https?[:][/]{2}[^/]/.test( ( '' + val ).trim() ) ) {
                    return '<a href="'+ val + '" target="_blank">Open in new window</a>'
                }

                return val
            },
            formatAttribute: function ( attr ) {
                /* jshint evil: true */
                var self = this

                var m = attr.format.match( /^(.+)[(](.+)[)]$/)
                if ( !m ) {
                    var value = SMK.UTIL.templateReplace( attr.value, function ( token ) {
                        return ( function () {
                            var e = eval( token )
                            // console.log( 'replace', token, e, this )
                            return e
                        } ).call( self )
                    } )
                    return formatter[ attr.format ]( Object.assign( {}, attr, { value: value } ), this.feature, this.layer )()
                }

                return formatter[ m[ 1 ] ]( attr, this.feature, this.layer ).apply( this, eval( '[' + m[ 2 ] + ']' ) )
            },
            formatTitle: function ( attr ) {
                /* jshint evil: true */
                var self = this

                var title = SMK.UTIL.templateReplace( attr.title, function ( token ) {
                    return ( function () {
                        var e = eval( token )
                        // console.log( 'replace', token, e, this )
                        return e
                    } ).call( self )
                } )

                return this.insertWordBreaks( title )
            }
        }
    }//)

    function makeFormatter( template, input ) {
        var component = Vue.extend( {
            template: template
        } )
        var formatInput = input || function () {}
        return function ( attribute, feature, layer ) {
            return function () {
                var inp = formatInput.apply( null, arguments )
                var c1 = Vue.extend( {
                    extends: component,
                    data: function () {
                        return Object.assign( {
                            attribute: attribute,
                            feature: feature,
                            layer: layer
                        }, inp )
                    }
                } )
                return new c1().$mount().$el.outerHTML
            }
        }
    }

    var formatter = {
        simple: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ attribute.value }}</span>' ),
        asLocalTimestamp: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleString() }}</span>' ),
        asLocalDate: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleDateString() }}</span>' ),
        asLocalTime: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleTimeString() }}</span>' ),
        asUnit: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ attribute.value }} <span class="smk-unit">{{ unit }}</span></span>', function ( unit ) {
            return { unit: unit }
        } ),
        asLink: makeFormatter( inc[ 'component.format-link-html' ], function ( url, label ) {
            return { url: url, label: label }
        } ),
        asHTML: makeFormatter( '<span class="smk-value" v-if="html" v-html="html"></span>', function ( html ) {
            return { html: html }
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.COMPONENT.ToolEmit = {
        methods: {
            $$emit: function ( event, arg ) {
                this.$root.trigger( this.id, event, arg, this )
            }
        }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.COMPONENT.ToolBase = {
        mixins: [ SMK.COMPONENT.ToolEmit ],
        props: {
            id:         String,
            type:       String,
            title:      String,
            status:     String,
            active:     Boolean,
            enabled:    Boolean,
            visible:    Boolean,
            group:      Boolean,
            showTitle:  Boolean,
            icon:       String
        },
        computed: {
            baseClasses: function () {
                var c = {
                    'smk-tool-active': this.active,
                    'smk-tool-visible': this.visible,
                    'smk-tool-enabled': this.enabled,
                }
                c[ 'smk-tool-' + this.id ] = true
                if ( this.status )
                    c[ 'smk-tool-status-' + this.status ] = true

                return c
            }
        }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    var componentProps = {}

    SMK.COMPONENT.ToolPanelBase = {
        extends: SMK.COMPONENT.ToolBase,
        props: {
            showPanel:      Boolean,
            showHeader:     Boolean,
            showSwipe:      Boolean,
            busy:           Boolean,
            expand:         Number,
            hasPrevious:    Boolean,
            parentId:       String,
        },
        computed: {
            classes: function () {
                var c = this.baseClasses
                return c
            }
        },
        methods: {
            $$projectProps: function ( componentName ) {
                if ( !componentProps[ componentName ] )
                    componentProps[ componentName ] = SMK.UTIL.projection.apply( null, Object.keys( ( new ( Vue.component( componentName ) )() )._props ) )

                return componentProps[ componentName ]( this.$props )
            }
        }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.COMPONENT.ToolWidgetBase = {
        extends: SMK.COMPONENT.ToolBase,
        template: inc[ 'component.tool-widget-html' ],
        props: {
            showWidget: Boolean,
        },
        computed: {
            classes: function () {
                var c = this.baseClasses
                c[ 'smk-tool-title' ] = this.showTitle
                return c
            }
        }
    }

} )