include.module( 'tool-query-results', [ 
    'tool.tool-base-js', 
    'tool.tool-feature-list-js', 
    'component-feature-list', 
    'component-command-button',
    'tool-query-results.panel-query-results-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'query-results-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-query-results.panel-query-results-html' ],
        props: [ 'tool', 'layers', 'highlightId', 'command' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'QueryResultsTool', 
        function () {
            SMK.TYPE.ToolPanel.call( this, 'query-results-panel' )
            SMK.TYPE.ToolFeatureList.call( this, function ( smk ) { return smk.$viewer.queried[ this.instance ] } )
        
            this.defineProp( 'tool' )
            this.defineProp( 'command' )

            this.tool = {}
            this.command = {}
        },
        function ( smk ) {
            var self = this

            this.title = smk.$viewer.query[ this.instance ].title

            this.tool.select = smk.$tool.select
            this.tool.zoom = smk.$tool.zoom

            smk.on( this.id, {
                'previous-panel': function () {
                    self.featureSet.clear()
                },
            } )

            self.featureSet.addedFeatures( function ( ev ) {
                var stat = self.featureSet.getStats()

                self.active = true;

                self.showStatusMessage( '<div>Found ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' )
            } )
        } 
    )
} )
