
include.module( 'tool-query-feature', [ 'feature-list' ], function ( inc ) {
    "use strict";

    function QueryFeatureTool( option ) {
        SMK.TYPE.FeaturePanel.prototype.constructor.call( this, $.extend( {
            order:              4,
            title:              'query Results1',
            panelComponent:     'feature-panel',
        }, option ) )
    }

    SMK.TYPE.QueryFeatureTool = QueryFeatureTool

    $.extend( QueryFeatureTool.prototype, SMK.TYPE.FeaturePanel.prototype )
    QueryFeatureTool.prototype.afterInitialize = SMK.TYPE.FeaturePanel.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryFeatureTool.prototype.afterInitialize.unshift( function ( smk ) {
        // this.featureSet = smk.$viewer.identified
    } )

    QueryFeatureTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var featureIds = {}

        this.tool.select = smk.$tool.select
        this.tool.zoom = smk.$tool.zoom

        self.changedActive( function () {
            if ( self.active ) {
                smk.$tool[ 'query' ].visible = true
                self.featureSet.highlight()
            }
            else {
                smk.$tool[ 'query' ].visible = false
            }
        } )

        smk.on( this.id, {
            'zoom': function ( ev ) {
                smk.$viewer.queried[ ev.instance ].zoomTo( featureIds[ ev.instance ][ self.resultPosition ] )
            },
            'select': function ( ev ) {
                var f = smk.$viewer.queried[ ev.instance ].get( featureIds[ ev.instance ][ self.resultPosition ] )
                smk.$viewer.selected.add( f.layerId, [ f ] )
            },
            'directions': console.log,
            'move-previous': function ( ev ) {
                smk.$viewer.queried[ ev.instance ].pick( featureIds[ ev.instance ][ ( self.resultPosition + self.resultCount - 1 ) % self.resultCount ] )
            },
            'move-next': function ( ev ) {
                smk.$viewer.queried[ ev.instance ].pick( featureIds[ ev.instance ][ ( self.resultPosition + 1 ) % self.resultCount ] )
            },
        } )

        Object.keys( smk.$viewer.queried ).forEach( function ( instance ) {
            smk.$viewer.queried[ instance ].pickedFeature( function ( ev ) {
                if ( !ev.feature ) {
                    self.feature = null
                    self.layer = null
                    return
                }

                self.active = true
                self.instance = instance

                var ly = smk.$viewer.layerId[ ev.feature.layerId ]
                self.layer = {
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

                self.feature = {
                    id:         ev.feature.id,
                    title:      ev.feature.title,
                    properties: Object.assign( {}, ev.feature.properties )
                }

                self.title = '<h3>' + self.layer.title + '</h3>' + '<h2>' + self.feature.title + '</h2>'

                self.setAttributeComponent( ly, ev.feature )

                self.resultCount = smk.$viewer.queried[ instance ].getStats().featureCount 
                self.resultPosition = featureIds[ instance ].indexOf( ev.feature.id )
            } )

            smk.$viewer.queried[ instance ].addedFeatures( function ( ev ) {
                featureIds[ instance ] = Object.keys( smk.$viewer.queried[ instance ].featureSet )
            } )

            smk.$viewer.queried[ instance ].clearedFeatures( function ( ev ) {
                // self.resultCount = 0
            } )

        } )



    } )

    return QueryFeatureTool
} )
