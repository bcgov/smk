include.module( 'tool-identify', [ 'feature-list', 'widgets', 'tool-identify.panel-identify-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'identify-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'identify-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-identify.panel-identify-html' ],
        props: [ 'tool', 'layers', 'highlightId', 'command' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function IdentifyTool( option ) {
        this.makePropWidget( 'icon', null )//'info_outline' )

        this.makePropPanel( 'tool', {} )

        SMK.TYPE.FeatureList.prototype.constructor.call( this, $.extend( {
            // order:              4,
            // position:           'menu',
            // title:              'Identify Results',
            widgetComponent:    'identify-widget',
            panelComponent:     'identify-panel',
            // showPanel:          false,
            showFeatures:       'popup'
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

        this.tool.select = smk.$tool.select
        this.tool.zoom = smk.$tool.zoom

        self.setMessage( 'Click on map to identify features.' )

        self.changedGroup( function () {
            if ( !self.group ) {
                smk.$viewer.identified.clear()
                smk.$viewer.identified.pick()
            }
        } )

        // fallback handler if nothing else uses pick
        smk.$viewer.handlePick( 0, function ( location ) {
            return startIdentify( location )
        } )

        smk.$viewer.handlePick( 2, function ( location ) {
            if ( !self.active ) return

            return startIdentify( location )
        } )

        var startIdentify = function ( location ) {
            self.pickedLocation = null
            return smk.$viewer.identifyFeatures( location )
                .then( function () {
                    self.pickedLocation = location
                    return true
                } )
        }

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

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
            },

            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            },

        } )

        smk.$viewer.startedIdentify( function ( ev ) {
            self.busy = true
            self.firstId = null
            // self.active = true
            self.setMessage( 'Fetching features', 'progress' )
        } )

        smk.$viewer.finishedIdentify( function ( ev ) {
            self.busy = false

            if ( smk.$viewer.identified.isEmpty() ) {
                smk.$sidepanel.setExpand( 0 )
                self.setMessage( 'No features found', 'warning' )
            }
            else {
                self.active = true
                var stat = smk.$viewer.identified.getStats()

                var sub = SMK.UTIL.grammaticalNumber( stat.layerCount, null, null, 'on {} layers' )
                // if ( stat.vertexCount > stat.featureCount )
                //     sub += ( sub == '' ? '' : ', ' ) + SMK.UTIL.grammaticalNumber( stat.vertexCount, null, null, 'with {} vertices' )
                if ( sub != '' ) sub = '<div class="smk-submessage">' + sub + '</div>'

                self.setMessage( '<div>Identified ' + SMK.UTIL.grammaticalNumber( stat.featureCount, null, 'a feature', '{} features' ) + '</div>' + sub )

                if ( stat.featureCount == 1 ) {
                    var id = Object.keys( smk.$viewer.identified.featureSet )[ 0 ]
                    smk.$viewer.identified.pick( id )
                }
            }
        } )
    } )

    IdentifyTool.prototype.getLocation = function () {
        return this.pickedLocation.map
    }

    return IdentifyTool
} )
