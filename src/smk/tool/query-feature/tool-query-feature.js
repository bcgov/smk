
include.module( 'tool-query-feature', [ 'feature-list' ], function ( inc ) {
    "use strict";

    function QueryFeatureTool( option ) {
        SMK.TYPE.FeaturePanel.prototype.constructor.call( this, $.extend( {
            order:              4,
            title:              'query Results1',
            panelComponent:     'feature-panel',
            subPanel:           2
        }, option ) )
    }

    SMK.TYPE.QueryFeatureTool = QueryFeatureTool

    $.extend( QueryFeatureTool.prototype, SMK.TYPE.FeaturePanel.prototype )
    QueryFeatureTool.prototype.afterInitialize = SMK.TYPE.FeaturePanel.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryFeatureTool.prototype.afterInitialize.unshift( function ( smk ) {
        this.featureSet = smk.$viewer.queried[ this.instance ]

        this.title = smk.$viewer.query[ this.instance ].title
    } )

    QueryFeatureTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var featureIds = []

        this.tool.select = smk.$tool.select
        this.tool.zoom = smk.$tool.zoom

        self.changedActive( function () {
            if ( self.active ) {
                self.featureSet.highlight()
            }
            else {
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
            },
            'move-next': function ( ev ) {
                self.featureSet.pick( featureIds[ ( self.resultPosition + 1 ) % self.resultCount ] )
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
        } )

        self.featureSet.addedFeatures( function ( ev ) {
            featureIds = Object.keys( self.featureSet.featureSet )
        } )

        // self.featureSet.clearedFeatures( function ( ev ) {
            // self.resultCount = 0
        // } )

    } )

    return QueryFeatureTool
} )
