
include.module( 'tool-identify-feature', [ 'feature-list', 'widgets', 'tool-identify-feature.panel-identify-feature-html' ], function ( inc ) {
    "use strict";

    // Vue.component( 'identify-widget', {
    //     extends: inc.widgets.toolButton,
    // } )

    // Vue.component( 'identify-feature-panel', {
    //     extends: inc.widgets.toolPanel,
    //     template: inc[ 'tool-identify-feature.panel-identify-feature-html' ],
    //     props: [ 'feature', 'layer', 'attributeComponent', 'tool', 'hasMultiple', 'position' ],
    // } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function IdentifyFeatureTool( option ) {
        // this.makePropWidget( 'icon', 'info_outline' )

        SMK.TYPE.FeaturePanel.prototype.constructor.call( this, $.extend( {
            order:              4,
            title:              'Identify Results1',
            // widgetComponent:    'identify-widget',
            panelComponent:     'feature-panel',
            // showPanel:          false
        }, option ) )
    }

    SMK.TYPE.IdentifyFeatureTool = IdentifyFeatureTool

    $.extend( IdentifyFeatureTool.prototype, SMK.TYPE.FeaturePanel.prototype )
    IdentifyFeatureTool.prototype.afterInitialize = SMK.TYPE.FeaturePanel.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    IdentifyFeatureTool.prototype.afterInitialize.unshift( function ( smk ) {
        this.featureSet = smk.$viewer.identified
    } )

    IdentifyFeatureTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        // self.setMessage( 'Click on map to identify features.' )

        self.changedActive( function () {
            if ( self.active ) {
            }
            else {
                self.featureSet.pick()
            }
        } )

        // smk.$viewer.handlePick( 0, function ( location ) {
        //     self.pickedLocation = null
        //     return smk.$viewer.identifyFeatures( location )
        //         .then( function () {
        //             self.pickedLocation = location
        //             return true
        //         } )
        // } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            // 'add-all': function ( ev ) {
            //     self.layers.forEach( function ( ly ) {
            //         smk.$viewer.selected.add( ly.id, ly.features.map( function ( ft ) {
            //             return smk.$viewer.identified.get( ft.id )
            //         } ) )
            //     } )
            // },

            // 'clear': function ( ev ) {
            //     self.setMessage( 'Click on map to identify features.' )
            // }
        } )

        // smk.$viewer.startedIdentify( function ( ev ) {
        //     self.busy = true
        //     self.firstId = null
        //     self.active = true
        //     self.setMessage( 'Fetching features', 'progress' )
        // } )

        // smk.$viewer.finishedIdentify( function ( ev ) {
        //     self.busy = false

        //     if ( smk.$viewer.identified.isEmpty() ) {
        //         self.active = false
        //         self.setMessage( 'No features found', 'warning' )
        //     }
        //     else {
        //         smk.$viewer.identified.pick( self.firstId )

        //         var stat = smk.$viewer.identified.getStats()

        //         var sub = SMK.UTIL.grammaticalNumber( stat.layerCount, null, null, 'on {} layers' )
        //         // if ( stat.vertexCount > stat.featureCount )
        //         //     sub += ( sub == '' ? '' : ', ' ) + SMK.UTIL.grammaticalNumber( stat.vertexCount, null, null, 'with {} vertices' )
        //         if ( sub != '' ) sub = '<div class="smk-submessage">' + sub + '</div>'

        //         self.setMessage( '<div>Identified ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' + sub )
        //     }
        // } )

        // var onChangedViewStart = SMK.UTIL.makeDelayedCall( function () {
        //     var picked = smk.$viewer.identified.getPicked()
        //     if ( !picked ) return

        //     // console.log( 'onChangedViewStart' )

        //     self.wasPickedId = picked.id
        //     smk.$viewer.identified.pick( null )
        // }, { delay: 400 } )

        // var onChangedViewEnd = SMK.UTIL.makeDelayedCall( function () {
        //     if ( !self.wasPickedId ) return

        //     // console.log( 'onChangedViewEnd' )

        //     smk.$viewer.identified.pick( self.wasPickedId )
        //     self.wasPickedId = null
        // }, { delay: 410 } )

        // smk.$viewer.changedView( function ( ev ) {
        //     if ( !self.active ) return

        //     if ( ev.operation == 'move' ) return

        //     // console.log( self.wasPickedId, ev )

        //     if ( ev.after == 'start' ) return onChangedViewStart()
        //     if ( ev.after == 'end' ) return onChangedViewEnd()
        // } )

        // if ( smk.$tool.directions && !smk.$tool.location )
        //     this.popupModel.tool.directions = true

        // this.makePropPanel( 'feature', null )
        // this.makePropPanel( 'layer', null )
        // this.makePropPanel( 'attributeComponent', null )
        // this.makePropPanel( 'tool', {} )
        // this.makePropPanel( 'hasMultiple', false )
        // this.makePropPanel( 'position', null )
        // this.makePropPanel( 'attributeView', 'default' )

        self.featureSet.pickedFeature( function ( ev ) {
            if ( !ev.feature ) {
                // self.highlightId = null
                self.feature = null
                self.layer = null
                return
            }

            self.active = true
            // self.highlightId = ev.feature.id

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
        } )

        // self.featureSet.pickedFeature( function ( ev ) {
        //     if ( !ev.feature ) return


        //     var ly = self.marker[ ev.feature.id ]
        //     var parent = self.cluster.getVisibleParent( ly )

        //     if ( ly === parent || !parent ) {
        //         self.popupModel.hasMultiple = false
        //         self.popupFeatureIds = null
        //         self.popupCurrentIndex = null

        //         self.popup
        //             .setLatLng( ly.getLatLng() )
        //             .openOn( smk.$viewer.map )
        //     }
        //     else {
        //         var featureIds = parent.getAllChildMarkers().map( function ( m ) {
        //             return m.options.featureId
        //         } )

        //         self.popupModel.hasMultiple = true
        //         self.popupCurrentIndex = featureIds.indexOf( ev.feature.id )
        //         self.popupModel.position = ( self.popupCurrentIndex + 1 ) + ' / ' + featureIds.length
        //         self.popupFeatureIds = featureIds

        //         self.popup
        //             .setLatLng( parent.getLatLng() )
        //             .openOn( smk.$viewer.map )
        //     }
        // } )

    } )

    // IdentifyFeatureTool.prototype.getLocation = function () {
    //     return this.pickedLocation.map
    // }

    // IdentifyFeatureTool.prototype.hasPickPriority = function ( toolIdSet ) {
    //     return !toolIdSet.location
    // }

    return IdentifyFeatureTool
} )
