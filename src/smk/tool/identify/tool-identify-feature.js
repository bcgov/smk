include.module( 'tool-identify.tool-identify-feature-js', [
    'component-tool-panel-feature',
    'tool.tool-panel-feature-js'
 ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'IdentifyFeatureTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'tool-panel-feature' )
            SMK.TYPE.ToolPanelFeature.call( this, function ( smk ) { return smk.$viewer.identified } )

            this.parentId = 'IdentifyListTool'
        },
        function ( smk ) {
            var self = this

            var featureIds

            self.changedActive( function () {
                if ( self.active ) {
                    self.featureSet.highlight()
                    Vue.nextTick( function () {
                        smk.getToolById( self.parentId ).visible = true
                    } )
                }
                else {
                    self.featureSet.pick()
                }
            } )

            smk.getToolById( 'IdentifyListTool' ).startedIdentify( function () {
                smk.getToolById( self.parentId ).active = true
            } )

            smk.on( this.id, {
                'zoom': function () {
                    self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
                },
                'select': function () {
                    var f = self.featureSet.get( featureIds[ self.resultPosition ] )
                    smk.$viewer.selected.add( f.layerId, [ f ] )
                },
                'directions': console.log,
                'move-previous': function () {
                    self.featureSet.pick( featureIds[ ( self.resultPosition + self.resultCount - 1 ) % self.resultCount ] )
                },
                'move-next': function () {
                    self.featureSet.pick( featureIds[ ( self.resultPosition + 1 ) % self.resultCount ] )
                },
            } )

            self.featureSet.addedFeatures( function ( ev ) {
                self.resultCount = self.featureSet.getStats().featureCount

                featureIds =  Object.keys( self.featureSet.featureSet )
            } )

            self.featureSet.clearedFeatures( function ( ev ) {
                self.resultCount = 0
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
                    geometry:   ev.feature.geometry,
                    properties: Object.assign( {}, ev.feature.properties )
                }

                self.setAttributeComponent( ly, ev.feature )

                self.resultPosition = featureIds.indexOf( ev.feature.id )

                smk.$viewer.panToFeature( ev.feature )
            } )
        }
    )
} )
