include.module( 'tool.tool-panel-feature-js', [ 
    'tool.tool-panel-js',
    'tool.feature-attributes-html',
    'tool.feature-properties-html',
    'tool.feature-description-html',
    'tool.format-link-html',
    'tool.tool-panel-feature-html',
    'widgets'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-attribute', {
        template: '<div class="smk-attribute" v-if="title && value && value.trim()"><span class="smk-attribute-title" v-html="title"></span><span v-html="value"></span></div>',
        props: {
            title: { type: String },
            value: { type: String },
        }        
    } )

    var featureComponent = SMK.COMPONENT.Feature = Vue.extend( {
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
    } )

    Vue.component( 'feature-attributes', {
        extends: featureComponent,
        template: inc[ 'tool.feature-attributes-html' ],
    } )

    Vue.component( 'feature-properties', {
        extends: featureComponent,
        template: inc[ 'tool.feature-properties-html' ],
        computed: {
            sortedProperties: function () {
                if ( !this.feature || !this.feature.properties ) return []
                return Object.keys( this.feature.properties ).sort()
            }
        }
    } )

    Vue.component( 'feature-description', {
        extends: featureComponent,
        template: inc[ 'tool.feature-description-html' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'feature-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool.tool-panel-feature-html' ],
        props: [ 'feature', 'layer', 'attributeComponent', 'tool', 'resultPosition', 'resultCount', 'instance', 'command' ],
        data: function () {
            return {
                'attributeView': 'default'
            }
        },
        computed: {
            attributes: {
                get: function () {
                    var ft = this.feature
                    if ( !this.layer.attributes ) return []
                    return this.layer.attributes
                        .filter( function ( at ) { return at.visible !== false } )
                        .map( function ( at ) {
                            return {
                                id: at.name || at.title,
                                name: at.name,
                                title: at.title,
                                value: at.name ? ft.properties[ at.name ] : at.value,
                                format: at.format || 'simple'
                            } 
                        } )
                }
            }
        }
    } )

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
        asLink: makeFormatter( inc[ 'feature-list.format-link-html' ], function ( url, label ) {
            return { url: url, label: label }
        } ),
        asHTML: makeFormatter( '<span class="smk-value" v-if="html" v-html="html"></span>', function ( html ) {
            return { html: html }
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.ToolPanelFeature = function () {
        this.defineProp( 'feature' )
        this.defineProp( 'layer' )
        this.defineProp( 'attributeComponent' )
        this.defineProp( 'tool' )
        this.defineProp( 'resultPosition' )
        this.defineProp( 'resultCount' )
        this.defineProp( 'instance' )
        this.defineProp( 'attributeView' )
        this.defineProp( 'command' )
        this.defineProp( 'attributes' )

        this.tool = {}
        this.attributeView = 'default'
        this.command = {}

        this.$propFilter.attributes = false
       
        this.$initializers.push( function ( smk ) {
            smk.on( this.id, {
                'swipe-up': function ( ev ) {
                    smk.$sidepanel.setExpand( 2 )
                },
    
                'swipe-down': function ( ev ) {
                    smk.$sidepanel.incrExpand( -1 )
                }
            } )
        } )

        this.setAttributeComponent = function ( layer, feature ) {
            if ( layer.config.popupTemplate ) {
                var template
    
                if ( layer.config.popupTemplate.startsWith( '@' ) ) {
                    this.attributeComponent = layer.config.popupTemplate.substr( 1 )
                }
                else {
                    this.attributeComponent = 'feature-template-' + layer.config.id
                    template = layer.config.popupTemplate
                }
    
                if ( !Vue.component( this.attributeComponent ) ) {
                    if ( template ) {
                        try {
                            Vue.component( this.attributeComponent, {
                                template:           template,
                                extends:            featureComponent,
                            } )
                        }
                        catch ( e ) {
                            console.warn( 'failed compiling template:', this.attributeComponent, e )
                            layer.config.popupTemplate = null
                        }
                    }
                    else {
                        console.warn( 'component not found:', this.attributeComponent )
                        layer.config.popupTemplate = null
                    }
                }
    
                if ( Vue.component( this.attributeComponent ) )
                    return
            }
    
            if ( feature.properties.description ) {
                this.attributeComponent = 'feature-description'
                return
            }
    
            if ( layer.config.attributes ) {
                this.attributeComponent = 'feature-attributes'
                return
            }
    
            this.attributeComponent = 'feature-properties'
        }
    
    }
} )
