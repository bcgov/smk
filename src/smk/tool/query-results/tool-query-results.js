include.module( 'tool-query-results', [ 'feature-list', 'widgets', 'tool-query-results.panel-query-results-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'query-results-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-query-results.panel-query-results-html' ],
        props: [ 'tool', 'layers', 'highlightId' ],
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
        this.makePropPanel( 'tool', {} )

        SMK.TYPE.FeatureList.prototype.constructor.call( this, $.extend( {
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

        this.title = smk.$viewer.query[ this.instance ].title
    } )

    QueryResultsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.tool.select = smk.$tool.select
        this.tool.zoom = smk.$tool.zoom

        self.featureSet.addedFeatures( function ( ev ) {
            var stat = self.featureSet.getStats()

            self.active = true;

            self.setMessage( '<div>Found ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' )
        } )

    } )

    return QueryResultsTool
} )
