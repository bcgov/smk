include.module( 'feature-list', [ 'tool', 'widgets', 'sidepanel',
    'feature-list.panel-feature-list-html',
    'feature-list.feature-attributes-html',
    'feature-list.feature-properties-html',
    'feature-list.feature-description-html',
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

    var featureComponent = Vue.extend( {
        props: [ 'feature', 'layer', 'showHeader' ],
        methods: {
            insertWordBreaks: function ( str ) {
                return str.replace( /[^a-z0-9 ]+/ig, function ( m ) { return '<wbr>' + m } )
            },
            formatValue: function ( val ) {
                if ( /^https?[:][/]{2}[^/]/.test( ( '' + val ).trim() ) ) {
                    return '<a href="'+ val + '" target="_blank">' + val + '</a>'
                }

                return val
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
                console.log( 'swipe-up' )
            },

            'swipe-down': function ( ev ) {
                console.log( 'swipe-down' )
            }

        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        self.featureSet.addedFeatures( function ( ev ) {
            self.active = true

            var ly = smk.$viewer.layerId[ ev.layerId ]
            var index = smk.$viewer.layerDisplayContext.getLayerIndex( ev.layerId )

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
            var index = smk.$viewer.layerDisplayContext.getLayerIndex( ev.features[ 0 ].layerId )

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
        }
    } )

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

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            // debugView: false
            subPanel: 1
        }, option ) )
    }

    SMK.TYPE.FeaturePanel = FeaturePanel

    $.extend( FeaturePanel.prototype, SMK.TYPE.Tool.prototype )
    FeaturePanel.prototype.afterInitialize = []

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
