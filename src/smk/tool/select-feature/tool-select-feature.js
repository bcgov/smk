
include.module( 'tool-select-feature', [ 'feature-list' ], function ( inc ) {
    "use strict";

    function SelectFeatureTool( option ) {
        SMK.TYPE.FeaturePanel.prototype.constructor.call( this, $.extend( {
            order:              4,
            panelComponent:     'feature-panel',
        }, option ) )
    }

    SMK.TYPE.SelectFeatureTool = SelectFeatureTool

    $.extend( SelectFeatureTool.prototype, SMK.TYPE.FeaturePanel.prototype )
    SelectFeatureTool.prototype.afterInitialize = SMK.TYPE.FeaturePanel.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SelectFeatureTool.prototype.afterInitialize.unshift( function ( smk ) {
        this.featureSet = smk.$viewer.selected
    } )

    SelectFeatureTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var featureIds

        this.tool.zoom = smk.$tool.zoom

        self.changedActive( function () {
            if ( self.active ) {
                smk.$tool[ 'select' ].visible = true
                self.featureSet.highlight()
            }
            else {
                smk.$tool[ 'select' ].visible = false
            }
        } )

        smk.on( this.id, {
            'zoom': function () {
                self.featureSet.zoomTo( featureIds[ self.resultPosition ] )
            },
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
                properties: Object.assign( {}, ev.feature.properties )
            }

            self.setAttributeComponent( ly, ev.feature )

            self.resultPosition = featureIds.indexOf( ev.feature.id )
        } )

    } )

    return SelectFeatureTool
} )
