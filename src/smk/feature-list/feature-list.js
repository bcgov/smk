include.module( 'feature-list', [ 'tool', 'widgets',
    'feature-list.panel-feature-list-html',
    'feature-list.popup-feature-html',
    'feature-list.feature-attributes-html',
    'feature-list.feature-properties-html',
    'feature-list.feature-description-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-list-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'feature-list.panel-feature-list-html' ],
        props: [ 'busy', 'layers', 'highlightId', 'canRemove', 'canClear', 'statusMessage' ],
        computed: {
            featureCount: {
                get: function () {
                    if ( !this.layers || this.layers.length == 0 ) return 0
                    return this.layers.reduce( function ( accum, ly ) { return accum + ly.features.length }, 0 )
                }
            }
        },
    } )

    var featurePopup = Vue.extend( {
        props: [ 'feature', 'layer' ],
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
        extends: featurePopup,
        template: inc[ 'feature-list.feature-attributes-html' ],
    } )

    Vue.component( 'feature-properties', {
        extends: featurePopup,
        template: inc[ 'feature-list.feature-properties-html' ],
        computed: {
            sortedProperties: function () {
                if ( !this.feature || !this.feature.properties ) return []
                return Object.keys( this.feature.properties ).sort()
            }
        }
    } )

    Vue.component( 'feature-description', {
        extends: featurePopup,
        template: inc[ 'feature-list.feature-description-html' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function FeatureList( option ) {
        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'layers', [] )
        this.makePropPanel( 'highlightId', null )
        this.makePropPanel( 'statusMessage', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            debugView: false
        }, option ) )
    }

    SMK.TYPE.FeatureList = FeatureList

    $.extend( FeatureList.prototype, SMK.TYPE.Tool.prototype )
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

        self.featureSet.pickedFeature( function ( ev ) {
            if ( !ev.feature ) {
                self.highlightId = null
                self.popupModel.layer = null
                self.popupModel.feature = null
                return
            }

            self.highlightId = ev.feature.id

            var ly = smk.$viewer.layerId[ ev.feature.layerId ]
            self.popupModel.layer = {
                id:         ev.feature.layerId,
                title:      ly.config.title,
                attributes: ly.config.attributes && ly.config.attributes.map( function ( at ) {
                    return {
                        visible:at.visible,
                        title:  at.title,
                        name:   at.name
                    }
                } )
            }

            self.popupModel.feature = {
                id:         ev.feature.id,
                title:      ev.feature.title,
                properties: Object.assign( {}, ev.feature.properties )
            }

            self.setPopupAttributeComponent( ly, ev.feature, ly.config.featureTemplate )
        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        this.popupModel = {
            feature: null,
            layer: null,
            attributeComponent: null,
            tool: {},
            hasMultiple: false,
            position: null,
            attributeView: 'default',
        }

        this.popupFeatureIds = null
        this.popupCurrentIndex = null

        if ( smk.$tool.select && this.type != 'select' )
            this.popupModel.tool.select = true

        if ( smk.$tool.zoom )
            this.popupModel.tool.zoom = true

        if ( this.debugView )
            this.popupModel.tool.attributeView = true

        this.popupVm = new Vue( {
            el: smk.addToContainer( inc[ 'feature-list.popup-feature-html' ] ),
            data: this.popupModel,
            methods: {
                // debug: function ( x ) {
                //     console.log( arguments )
                //     return x
                // },
                zoomToFeature: function ( layerId, featureId ) {
                    return self.featureSet.zoomTo( featureId )
                },

                selectFeature: function ( layerId, featureId ) {
                    smk.$viewer.selected.add( layerId, [ self.featureSet.get( featureId ) ] )
                },

                startDirections: function () {
                    smk.$tool.directions.active = true

                    smk.$tool.directions.activating
                        .then( function () {
                            return smk.$tool.directions.startAtCurrentLocation()
                        } )
                        .then( function () {
                            return SMK.UTIL.findNearestSite( self.getLocation() )
                                .then( function ( site ) {
                                    return smk.$tool.directions.addWaypoint( site )
                                } )
                                .catch( function ( err ) {
                                    console.warn( err )
                                    return smk.$tool.directions.addWaypoint()
                                } )
                        } )
                },

                movePrevious: function () {
                    var l = self.popupFeatureIds.length
                    self.popupCurrentIndex = ( self.popupCurrentIndex + l - 1 ) % l
                    this.position = ( self.popupCurrentIndex + 1 ) + ' / ' + l
                    self.featureSet.pick( self.popupFeatureIds[ self.popupCurrentIndex ] )
                },

                moveNext: function () {
                    var l = self.popupFeatureIds.length
                    self.popupCurrentIndex = ( self.popupCurrentIndex + 1 ) % l
                    this.position = ( self.popupCurrentIndex + 1 ) + ' / ' + l
                    self.featureSet.pick( self.popupFeatureIds[ self.popupCurrentIndex ] )
                }
            },
            updated: function () {
                if ( self.active && this.feature )
                    self.updatePopup()
            }
        } )

    } )

    FeatureList.prototype.setPopupAttributeComponent = function ( layer, feature ) {
        if ( layer.config.popupTemplate ) {
            var template

            if ( layer.config.popupTemplate.startsWith( '@' ) ) {
                this.popupModel.attributeComponent = layer.config.popupTemplate.substr( 1 )
            }
            else {
                this.popupModel.attributeComponent = 'feature-template-' + layer.config.id
                template = layer.config.popupTemplate
            }

            if ( !Vue.component( this.popupModel.attributeComponent ) ) {
                if ( template ) {
                    try {
                        Vue.component( this.popupModel.attributeComponent, {
                            template:           template,
                            extends:            featurePopup,
                        } )
                    }
                    catch ( e ) {
                        console.warn( 'failed compiling template:', this.popupModel.attributeComponent, e )
                        layer.config.popupTemplate = null
                    }
                }
                else {
                    console.warn( 'component not found:', this.popupModel.attributeComponent )
                    layer.config.popupTemplate = null
                }
            }

            if ( Vue.component( this.popupModel.attributeComponent ) )
                return
        }

        if ( feature.properties.description ) {
            this.popupModel.attributeComponent = 'feature-description'
            return
        }

        if ( layer.config.attributes ) {
            this.popupModel.attributeComponent = 'feature-attributes'
            return
        }

        this.popupModel.attributeComponent = 'feature-properties'
    }

    FeatureList.prototype.setMessage = function ( message, status, delay ) {
        if ( !message ) {
            this.statusMessage = null
            return
        }

        this.statusMessage = {
            message: message,
            status: status
        }

        if ( delay )
            return SMK.UTIL.makePromise( function ( res ) { setTimeout( res, delay ) } )
    }

    return FeatureList
} )
