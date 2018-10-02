include.module( 'tool-query-results', [ 'feature-list', 'widgets', 'tool-query-results.panel-query-results-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'query-results-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-query-results.panel-query-results-html' ],
        props: [ 'busy', 'layers', 'highlightId', 'statusMessage' ],
        methods: {
            featureListProps: function () {
                var self = this

                var prop = {}
                Object.keys( Vue.component( 'feature-list-panel' ).options.props ).forEach( function ( p ) {
                    prop[ p ] = self[ p ]
                } )
                return prop
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function QueryResultsTool( option ) {
        SMK.TYPE.FeatureList.prototype.constructor.call( this, $.extend( {
            // order:          4,
            // position:       'menu',
            // title:          'Query',
            // widgetComponent:'query-widget',
            panelComponent: 'query-results-panel',
            subPanel:       1,
        }, option ) )

        if ( !this.instance )
            throw new Error( 'query tool needs an instance' )
    }

    SMK.TYPE.QueryResultsTool = QueryResultsTool

    $.extend( QueryResultsTool.prototype, SMK.TYPE.FeatureList.prototype )
    QueryResultsTool.prototype.afterInitialize = SMK.TYPE.FeatureList.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryResultsTool.prototype.afterInitialize.unshift( function ( smk ) {
        this.featureSet = smk.$viewer.queried[ this.instance ]

        // this.query = smk.$viewer.query[ this.instance ]

        this.title = smk.$viewer.query[ this.instance ].title
        // this.description = this.query.description
        // this.parameters = this.query.getParameters( smk.$viewer )

        // if ( !this.query.canUseWithExtent( smk.$viewer ) )
        //     this.config.within = null
    } )

    QueryResultsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        // self.setMessage( 'Configure parameters and click Search.' )

        // self.changedActive( function () {
        //     if ( self.active ) {
        //         switch ( self.onActivate ) {
        //         case 'execute':
        //             smk.emit( self.id, 'execute' )
        //             break
        //         }
        //     }
        // } )

        // smk.on( this.id, {
        //     'activate': function () {
        //         if ( !self.enabled ) return

        //         self.active = !self.active
        //     },

        //     'parameter-input': function ( ev ) {
        //         self.parameters[ ev.index ].prop.value = ev.value
        //     },

        //     'parameter-mounted': function ( ev ) {
        //         // console.log( 'parameter-mounted', ev.index )
        //         self.parameters[ ev.index ].mounted()
        //     },

        //     // 'active', function ( ev ) {
        //     //     smk.$viewer[ self.featureSetProperty ].pick( ev.featureId )
        //     // } )

        //     // 'hover', function ( ev ) {
        //     //     smk.$viewer[ self.featureSetProperty ].highlight( ev.features && ev.features.map( function ( f ) { return f.id } ) )
        //     // } )

        //     'reset': function ( ev ) {
        //         self.featureSet.clear()
        //         self.setMessage( 'Configure parameters and click Search.' )

        //         self.parameters.forEach( function ( p, i ) {
        //             p.prop.value = self.query.parameters[ i ].value
        //         } )
        //     },

        //     'execute': function ( ev ) {
        //         self.featureSet.clear()
        //         self.busy = true
        //         self.setMessage( 'Executing query', 'progress' )

        //         var param = {}
        //         self.parameters.forEach( function ( p, i ) {
        //             param[ p.prop.id ] = $.extend( {}, p.prop )
        //         } )

        //         return SMK.UTIL.promiseFinally( SMK.UTIL.resolved()
        //             .then( function () {
        //                 return self.query.queryLayer( param, self.config, smk.$viewer )
        //             } )
        //             .then( function ( features ) {
        //                 return asyncIterator(
        //                     function () {
        //                         return features.length > 0
        //                     },
        //                     function () {
        //                         var chunk = features.splice( 0, 50 )
        //                         self.featureSet.add( self.query.layerId, chunk )
        //                     },
        //                     5
        //                 )
        //             } )
        //             .catch( function ( err ) {
        //                 console.warn( err )
        //                 self.setMessage( 'Query returned no results', 'warning' )
        //             } ), function () {
        //                 self.busy = false
        //             } )

        //     },

        //     'config': function ( ev ) {
        //         Object.assign( self.config, ev )
        //     },

        //     'add-all': function ( ev ) {
        //         self.layers.forEach( function ( ly ) {
        //             smk.$viewer.selected.add( ly.id, ly.features.map( function ( ft ) {
        //                 return self.featureSet.get( ft.id )
        //             } ) )
        //         } )
        //     }
        // } )

        self.featureSet.addedFeatures( function ( ev ) {
            var stat = self.featureSet.getStats()

            self.active = true;

            self.setMessage( '<div>Found ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' )
        } )

    } )

    // function asyncIterator( test, body, delay ) {
    //     return SMK.UTIL.makePromise( function ( res, rej ) {
    //         try {
    //             if ( !test() ) return res( false )
    //             body()

    //             setTimeout( function () {
    //                 res( true )
    //             }, delay )
    //         }
    //         catch ( e ) {
    //             return rej( e )
    //         }
    //     } )
    //     .then( function ( cont ) {
    //         if ( !cont ) return

    //         return asyncIterator( test, body )
    //     } )
    // }

    return QueryResultsTool
} )
