include.module( 'feature-list', [ 'tool', 'widgets', 'sidepanel',
    'feature-list.panel-feature-list-html',
    'feature-list.feature-attributes-html',
    'feature-list.feature-properties-html',
    'feature-list.feature-description-html',
    'feature-list.format-link-html',
    'feature-list.panel-feature-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-list-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'feature-list.panel-feature-list-html' ],
        props: [ 'layers', 'highlightId', 'canRemove', 'canClear', 'command', 'showSwipe' ],
        computed: {
            featureCount: {
                get: function () {
                    if ( !this.layers || this.layers.length == 0 ) return 0
                    return this.layers.reduce( function ( accum, ly ) { return accum + ly.features.length }, 0 )
                }
            }
        },
    } )

    var featureComponent = SMK.TYPE.VueFeatureComponent = Vue.extend( {
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
        template: inc[ 'feature-list.feature-attributes-html' ],
    } )

    Vue.component( 'feature-properties', {
        extends: featureComponent,
        template: inc[ 'feature-list.feature-properties-html' ],
        computed: {
            sortedProperties: function () {
                if ( !this.feature || !this.feature.properties ) return []
                return Object.keys( this.feature.properties ).sort()
            }
        }
    } )

    Vue.component( 'feature-description', {
        extends: featureComponent,
        template: inc[ 'feature-list.feature-description-html' ],
    } )

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function FeatureList( option ) {
        this.makePropPanel( 'layers', [] )
        this.makePropPanel( 'highlightId', null )
        this.makePropPanel( 'command', {} )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            debugView: false
        }, option ) )
    }

    SMK.TYPE.FeatureList = FeatureList

    $.extend( FeatureList.prototype, SMK.TYPE.PanelTool.prototype )
    FeatureList.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    FeatureList.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'active': function ( ev ) {
                self.featureSet.pick( ev.featureId )
            },

            'hover': function ( ev ) {
                self.featureSet.highlight( ev.features && ev.features.map( function ( f ) { return f.id } ) )
            },

            'clear': function ( ev ) {
                self.featureSet.clear()
            },

            'remove': function ( ev ) {
                self.featureSet.remove( [ ev.featureId ] )
            },

            'swipe-up': function ( ev ) {
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }

        } )

        // this.changedActive( function () {
            // if ( !self.active )
                // self.featureSet.clear()
            // console.log( 'feature list active', self.active )
        // } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        self.featureSet.addedFeatures( function ( ev ) {
            self.active = true

            var ly = smk.$viewer.layerId[ ev.layerId ]
            // var index = smk.$viewer.layerDisplayContext.getLayerIndex( ev.layerId ) || 0
            var index = smk.$viewer.displayContext.layer.getLayerIndex( ev.layerId ) || 0

            if ( !self.layers[ index ] )
                Vue.set( self.layers, index, {
                    id:         ly.id,
                    title:      ly.config.title,
                    features:   []
                } )

            Vue.set( self.layers[ index ], 'features', self.layers[ index ].features.concat( ev.features.map( function ( ft ) {
                if ( !self.firstId )
                    self.firstId = ft.id

                return {
                    id:     ft.id,
                    title:  ft.title
                }
            } ) ) )
        } )

        self.featureSet.clearedFeatures( function ( ev ) {
            self.layers = []
            self.firstId = null
        } )

        self.featureSet.removedFeatures( function ( ev ) {
            var ly = smk.$viewer.layerId[ ev.features[ 0 ].layerId ]
            // var index = smk.$viewer.layerDisplayContext.getLayerIndex( ev.features[ 0 ].layerId ) || 0
            var index = smk.$viewer.displayContext.layers.getLayerIndex( ev.features[ 0 ].layerId ) || 0

            self.layers[ index ].features = self.layers[ index ].features.filter( function ( ft ) {
                return ft.id != ev.features[ 0 ].id
            } )
        } )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'feature-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'feature-list.panel-feature-html' ],
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
        simple: makeFormatter( '<span class="smk-value">{{ attribute.value }}</span>' ),
        asLocalTimestamp: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleString() }}</span>' ),
        asLocalDate: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleDateString() }}</span>' ),
        asLocalTime: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ ( new Date( attribute.value ) ).toLocaleTimeString() }}</span>' ),
        asUnit: makeFormatter( '<span class="smk-value" v-if="attribute.value">{{ attribute.value }} <span class="smk-unit">{{ unit }}</span></span>', function ( unit ) { 
            return { unit: unit } 
        } ),
        asLink: makeFormatter( inc[ 'feature-list.format-link-html' ], function ( url, label ) {
            return { url: url, label: label }
        } )
    }

    function FeaturePanel( option ) {
        this.makePropPanel( 'feature', null )
        this.makePropPanel( 'layer', null )
        this.makePropPanel( 'attributeComponent', null )
        this.makePropPanel( 'tool', {} )
        this.makePropPanel( 'resultPosition', null )
        this.makePropPanel( 'resultCount', null )
        this.makePropPanel( 'instance', null )
        this.makePropPanel( 'attributeView', 'default' )
        this.makePropPanel( 'command', {} )
        this.makePropPanel( 'attributes', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            // debugView: false
        }, option ) )
    }

    SMK.TYPE.FeaturePanel = FeaturePanel

    $.extend( FeaturePanel.prototype, SMK.TYPE.Tool.prototype )
    FeaturePanel.prototype.afterInitialize = []

    FeaturePanel.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'swipe-up': function ( ev ) {
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )
    } )

    FeaturePanel.prototype.setAttributeComponent = function ( layer, feature ) {
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
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return FeatureList
} )
