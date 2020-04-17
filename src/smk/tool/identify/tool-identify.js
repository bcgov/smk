include.module( 'tool-identify', [ 
    'tool.tool-base-js', 
    'tool.tool-widget-js', 
    'tool.tool-feature-list-js', 
    'component-feature-list', 
    'component-command-button',
    'tool-identify.panel-identify-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'identify-widget', {
        extends: SMK.COMPONENT.ToolWidgetBase,
    } )

    Vue.component( 'identify-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-identify.panel-identify-html' ],
        props: [ 'tool', 'layers', 'highlightId', 'command' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'IdentifyTool', 
        function () {
            SMK.TYPE.ToolWidget.call( this, 'identify-widget' )
            SMK.TYPE.ToolPanel.call( this, 'identify-panel' )
            SMK.TYPE.ToolFeatureList.call( this, function ( smk ) { return smk.$viewer.identified } )
        
            this.defineProp( 'tool' )
            this.defineProp( 'command' )

            this.tool = {}
            this.command = {}
        },
        function ( smk ) {
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
        },
        {
            getLocation: function () {
                return this.pickedLocation.map
            }
        }
    )
} )
