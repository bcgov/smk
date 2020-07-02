include.module( 'tool-select.tool-select-list-js', [
    'tool.tool-base-js',
    'tool.tool-widget-js',
    'tool.tool-feature-list-js',
    'component-feature-list',
    'component-command-button',
    'tool-select.panel-select-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'select-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'select-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-select.panel-select-html' ],
        props: [ 'layers', 'highlightId', 'command' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'SelectListTool',
        function () {
            SMK.TYPE.ToolWidget.call( this, 'select-widget' )
            SMK.TYPE.ToolPanel.call( this, 'select-panel' )
            SMK.TYPE.ToolFeatureList.call( this, function ( smk ) { return smk.$viewer.selected } )

            this.defineProp( 'command' )
        },
        function ( smk ) {
            var self = this

            self.showStatusMessage( 'Click on map to identify features and then add them to the selection.' )

            self.changedActive( function () {
                if ( self.active ) {
                    smk.$viewer.selected.pick()
                }
            } )

            smk.on( this.id, {
                'clear': function ( ev ) {
                    self.showStatusMessage( 'Click on map to identify features and then add them to the selection.' )
                }
            } )

            self.featureSet
                .addedFeatures( updateMessage )
                .removedFeatures( updateMessage )

            function updateMessage() {
                var stat = smk.$viewer.selected.getStats()

                if ( stat.featureCount == 0 ) {
                    self.showStatusMessage()
                    return
                }

                var sub = ''
                // if ( stat.vertexCount > stat.featureCount )
                    // sub = '<div class="smk-submessage">' + SMK.UTIL.grammaticalNumber( stat.vertexCount, null, null, 'with {} vertices' ) + '</div>'

                self.showStatusMessage( '<div>Selection contains ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' + sub )
            }
        }
    )

    // return SelectTool
} )
