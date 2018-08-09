include.module( 'tool-identify', [ 'feature-list', 'widgets', 'tool-identify.panel-identify-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'identify-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'identify-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-identify.panel-identify-html' ],
        props: [ 'busy', 'layers', 'highlightId', 'statusMessage' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function IdentifyTool( option ) {
        this.makePropWidget( 'icon', 'info_outline' )

        SMK.TYPE.FeatureList.prototype.constructor.call( this, $.extend( {
            order:              4,
            title:              'Identify',
            widgetComponent:    'identify-widget',
            panelComponent:     'identify-panel',
            showPanel:          false
        }, option ) )
    }

    SMK.TYPE.IdentifyTool = IdentifyTool

    $.extend( IdentifyTool.prototype, SMK.TYPE.FeatureList.prototype )
    IdentifyTool.prototype.afterInitialize = SMK.TYPE.FeatureList.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    IdentifyTool.prototype.afterInitialize.unshift( function ( smk ) {
        this.featureSet = smk.$viewer.identified
    } )

    IdentifyTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.setMessage( 'Click on map to identify features.' )

        self.changedActive( function () {
            if ( self.active ) {
                if ( self.firstId )
                    setTimeout( function () {
                        smk.$viewer.identified.pick( self.firstId )
                    }, 50 )
            }
        } )

        smk.$viewer.handlePick( 0, function ( location ) {
            self.pickedLocation = null
            return smk.$viewer.identifyFeatures( location )
                .then( function () {
                    self.pickedLocation = location
                    return true
                } )
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            'add-all': function ( ev ) {
                self.layers.forEach( function ( ly ) {
                    smk.$viewer.selected.add( ly.id, ly.features.map( function ( ft ) {
                        return smk.$viewer.identified.get( ft.id )
                    } ) )
                } )
            },

            'clear': function ( ev ) {
                self.setMessage( 'Click on map to identify features.' )
            }
        } )

        smk.$viewer.startedIdentify( function ( ev ) {
            self.busy = true
            self.firstId = null
            self.active = true
            self.setMessage( 'Fetching features', 'progress' )
        } )

        smk.$viewer.finishedIdentify( function ( ev ) {
            self.busy = false

            if ( smk.$viewer.identified.isEmpty() ) {
                self.active = false
                self.setMessage( 'No features found', 'warning' )
            }
            else {
                smk.$viewer.identified.pick( self.firstId )

                var stat = smk.$viewer.identified.getStats()

                var sub = SMK.UTIL.grammaticalNumber( stat.layerCount, null, null, 'on {} layers' )
                // if ( stat.vertexCount > stat.featureCount )
                //     sub += ( sub == '' ? '' : ', ' ) + SMK.UTIL.grammaticalNumber( stat.vertexCount, null, null, 'with {} vertices' )
                if ( sub != '' ) sub = '<div class="smk-submessage">' + sub + '</div>'

                self.setMessage( '<div>Identified ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' + sub )
            }
        } )

        var onChangedViewStart = SMK.UTIL.makeDelayedCall( function () {
            var picked = smk.$viewer.identified.getPicked()
            if ( !picked ) return

            // console.log( 'onChangedViewStart' )

            self.wasPickedId = picked.id
            smk.$viewer.identified.pick( null )
        }, { delay: 400 } )

        var onChangedViewEnd = SMK.UTIL.makeDelayedCall( function () {
            if ( !self.wasPickedId ) return

            // console.log( 'onChangedViewEnd' )

            smk.$viewer.identified.pick( self.wasPickedId )
            self.wasPickedId = null
        }, { delay: 410 } )

        smk.$viewer.changedView( function ( ev ) {
            if ( !self.active ) return

            if ( ev.operation == 'move' ) return

            // console.log( self.wasPickedId, ev )

            if ( ev.after == 'start' ) return onChangedViewStart()
            if ( ev.after == 'end' ) return onChangedViewEnd()
        } )

        if ( smk.$tool.directions && !smk.$tool.location )
            this.popupModel.tool.directions = true

    } )

    IdentifyTool.prototype.getLocation = function () {
        return this.pickedLocation.map
    }

    IdentifyTool.prototype.hasPickPriority = function ( toolIdSet ) {
        return !toolIdSet.location
    }

    return IdentifyTool
} )
