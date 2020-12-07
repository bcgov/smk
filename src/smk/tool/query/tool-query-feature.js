include.module( 'tool-query.tool-query-feature-js', [
    'component-tool-panel-feature',
    'tool.tool-panel-feature-js'
 ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'QueryFeatureTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'tool-panel-feature' )
            SMK.TYPE.ToolPanelFeature.call( this, function ( smk ) { return smk.$viewer.queried[ this.instance ] } )

            this.parentId = 'QueryResultsTool'
        },
        function ( smk ) {
            var self = this

            this.title = smk.$viewer.query[ this.instance ].title

            var featureIds = []

            self.changedActive( function () {
                if ( self.active ) {
                    self.featureSet.highlight()
                    Vue.nextTick( function () {
                        smk.getToolById( self.parentId ).visible = true

                        if ( self.command.zoom === false )
                            self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
                    } )
                }
                else {
                    self.featureSet.pick()
                }
            } )

            smk.on( this.id, {
                'previous-panel': function () {
                    self.featureSet.pick()
                },
                'zoom': function ( ev ) {
                    self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
                },
                'select': function ( ev ) {
                    var f = self.featureSet.get( featureIds[ self.resultPosition ] )
                    smk.$viewer.selected.add( f.layerId, [ f ] )
                },
                'directions': console.log,
                'move-previous': function ( ev ) {
                    self.featureSet.pick( featureIds[ ( self.resultPosition + self.resultCount - 1 ) % self.resultCount ] )
                    if ( self.command.zoom === false )
                        self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
                },
                'move-next': function ( ev ) {
                    self.featureSet.pick( featureIds[ ( self.resultPosition + 1 ) % self.resultCount ] )
                    if ( self.command.zoom === false )
                        self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
                },
            } )

            self.featureSet.pickedFeature( function ( ev ) {
                if ( !ev.feature ) {
                    self.feature = null
                    self.layer = null
                    return
                }

                self.active = true

                var ly = smk.$viewer.layerId[ ev.feature.layerId ]
                self.layer = {
                    id:         ev.feature.layerId,
                    title:      ly.config.title,
                    attributes: ly.config.attributes && ly.config.attributes.map( function ( at ) {
                        return {
                            visible:at.visible,
                            title:  at.title,
                            name:   at.name,
                            format: at.format,
                            value:  at.value
                        }
                    } )
                }

                self.feature = {
                    id:         ev.feature.id,
                    title:      ev.feature.title,
                    properties: Object.assign( {}, ev.feature.properties )
                }

                self.setAttributeComponent( ly, ev.feature )

                self.resultCount = self.featureSet.getStats().featureCount
                self.resultPosition = featureIds.indexOf( ev.feature.id )

                if ( self.command.zoom !== false )
                    smk.$viewer.panToFeature( ev.feature )
            } )

            self.featureSet.addedFeatures( function ( ev ) {
                featureIds = Object.keys( self.featureSet.featureSet )
            } )

            // self.featureSet.clearedFeatures( function ( ev ) {
                // self.resultCount = 0
            // } )
        }
    )
} )
