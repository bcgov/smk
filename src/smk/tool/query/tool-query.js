include.module( 'tool-query', [ 'feature-list', 'widgets', 'tool-query.panel-query-html', 'tool-query.parameter-input-html', 'tool-query.parameter-select-html', 'tool-query.parameter-constant-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'parameter-constant', {
        template: inc[ 'tool-query.parameter-constant-html' ],
        props: [ 'id', 'title', 'value', 'type' ],
        mounted: function () {
            this.$emit( 'mounted' )
        }
    } )

    Vue.component( 'parameter-input', {
        template: inc[ 'tool-query.parameter-input-html' ],
        props: [ 'id', 'title', 'value', 'type' ],
        data: function () {
            return {
                input: this.value
            }
        },
        watch: {
            value: function ( val ) {
                this.input = val
            }
        },
        mounted: function () {
            this.$emit( 'mounted' )
        }
    } )

    Vue.component( 'parameter-select', {
        template: inc[ 'tool-query.parameter-select-html' ],
        props: [ 'id', 'title', 'choices', 'value', 'type', 'useFallback' ],
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
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'query-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'query-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-query.panel-query-html' ],
        props: [ 'busy', 'layers', 'highlightId', 'description', 'parameters', 'config', 'statusMessage' ],
        data: function () {
            return Object.assign( {}, this.config )
        },
        watch: {
            config: function ( val ) {
                Object.keys( val ).forEach( function ( k ) {
                    this[ k ] = val[ k ]
                } )
            }
        },
        methods: {
            featureListProps: function () {
                var self = this

                var prop = {}
                Object.keys( Vue.component( 'feature-list-panel' ).options.props ).forEach( function ( p ) {
                    prop[ p ] = self[ p ]
                } )
                return prop
            },

            getConfigState: function () {
                var self = this

                var state = {}
                Object.keys( this.config ).forEach( function ( k ) {
                    state[ k ] = self[ k ]
                } )
                return state
            }
        },
        computed: {
            isReady: {
                get: function () {
                    return this.parameters.every( function ( p ) {
                        return p.prop.value != null
                    } )
                }
            },

            isModified: {
                get: function () {
                    return !this.parameters.every( function ( p ) {
                        return p.prop.value == p.initial
                    } )
                }
            }
        },
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function QueryTool( option ) {
        this.makePropWidget( 'icon', 'question_answer' )

        this.makePropPanel( 'description', null )
        this.makePropPanel( 'parameters', null )
        this.makePropPanel( 'config', {
            within: true
        } )

        SMK.TYPE.FeatureList.prototype.constructor.call( this, $.extend( {
            order:          4,
            title:          'Query',
            widgetComponent:'query-widget',
            panelComponent: 'query-panel',
        }, option ) )

        if ( !this.instance )
            throw new Error( 'query tool needs an instance' )
    }

    SMK.TYPE.QueryTool = QueryTool

    $.extend( QueryTool.prototype, SMK.TYPE.FeatureList.prototype )
    QueryTool.prototype.afterInitialize = SMK.TYPE.FeatureList.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryTool.prototype.afterInitialize.unshift( function ( smk ) {
        if ( !( this.instance in smk.$viewer.query ) )
            throw new Error( '"' + this.instance + '" is not a defined query' )

        this.featureSet = smk.$viewer.queried[ this.instance ]

        this.query = smk.$viewer.query[ this.instance ]

        this.title = this.query.title
        this.description = this.query.description
        this.parameters = this.query.getParameters( smk.$viewer )

        if ( !this.query.canUseWithExtent( smk.$viewer ) )
            this.config.within = null
    } )

    QueryTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.setMessage( 'Configure parameters and click Search.' )

        self.changedActive( function () {
            if ( self.active ) {
                switch ( self.onActivate ) {
                case 'execute':
                    smk.emit( self.id, 'execute' )
                    break
                }
            }
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            'parameter-input': function ( ev ) {
                self.parameters[ ev.index ].prop.value = ev.value
            },

            'parameter-mounted': function ( ev ) {
                // console.log( 'parameter-mounted', ev.index )
                self.parameters[ ev.index ].mounted()
            },

            // 'active', function ( ev ) {
            //     smk.$viewer[ self.featureSetProperty ].pick( ev.featureId )
            // } )

            // 'hover', function ( ev ) {
            //     smk.$viewer[ self.featureSetProperty ].highlight( ev.features && ev.features.map( function ( f ) { return f.id } ) )
            // } )

            'reset': function ( ev ) {
                self.featureSet.clear()
                self.setMessage( 'Configure parameters and click Search.' )

                self.parameters.forEach( function ( p, i ) {
                    p.prop.value = self.query.parameters[ i ].value
                } )
            },

            'execute': function ( ev ) {
                self.featureSet.clear()
                self.busy = true
                self.setMessage( 'Executing query', 'progress' )

                var param = {}
                self.parameters.forEach( function ( p, i ) {
                    param[ p.prop.id ] = $.extend( {}, p.prop )
                } )

                return SMK.UTIL.promiseFinally( SMK.UTIL.resolved()
                    .then( function () {
                        return self.query.queryLayer( param, self.config, smk.$viewer )
                    } )
                    .then( function ( features ) {
                        return asyncIterator(
                            function () {
                                return features.length > 0
                            },
                            function () {
                                var chunk = features.splice( 0, 50 )
                                self.featureSet.add( self.query.layerId, chunk )
                            },
                            5
                        )
                    } )
                    .catch( function ( err ) {
                        console.warn( err )
                        self.setMessage( 'Query returned no results', 'warning' )
                    } ), function () {
                        self.busy = false
                    } )

            },

            'config': function ( ev ) {
                Object.assign( self.config, ev )
            },

            'add-all': function ( ev ) {
                self.layers.forEach( function ( ly ) {
                    smk.$viewer.selected.add( ly.id, ly.features.map( function ( ft ) {
                        return self.featureSet.get( ft.id )
                    } ) )
                } )
            }
        } )

        self.featureSet.addedFeatures( function ( ev ) {
            var stat = self.featureSet.getStats()

            self.setMessage( '<div>Found ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' )
        } )

    } )

    function asyncIterator( test, body, delay ) {
        return SMK.UTIL.makePromise( function ( res, rej ) {
            try {
                if ( !test() ) return res( false )
                body()

                setTimeout( function () {
                    res( true )
                }, delay )
            }
            catch ( e ) {
                return rej( e )
            }
        } )
        .then( function ( cont ) {
            if ( !cont ) return

            return asyncIterator( test, body )
        } )
    }

    return QueryTool
} )
