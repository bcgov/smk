include.module( 'tool.tool-feature-list-js', [ 
    // 'tool.tool-panel-js',
    // 'tool.tool-panel-feature-list-html'
], function ( inc ) {
    "use strict";

    // Vue.component( 'feature-list-panel', {
    //     extends: SMK.COMPONENT.ToolPanel,
    //     template: inc[ 'tool.tool-panel-feature-list-html' ],
    //     props: [ 'layers', 'highlightId', 'canRemove', 'canClear', 'command', 'showSwipe' ],
    //     computed: {
    //         featureCount: {
    //             get: function () {
    //                 if ( !this.layers || this.layers.length == 0 ) return 0
    //                 return this.layers.reduce( function ( accum, ly ) { return accum + ly.features.length }, 0 )
    //             }
    //         }
    //     }
    // } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.ToolFeatureList = function ( featureSetCallback ) {
        this.defineProp( 'layers' )
        this.defineProp( 'highlightId' )
        // this.defineProp( 'canRemove' )
        // this.defineProp( 'canClear' )
        // this.defineProp( 'command' )
        // this.defineProp( 'debugView' )

        this.layers = []
        // this.command = {}
        // this.debugView = false

        // this.$propFilter.featureCount = false

        this.$initializers.push( function ( smk ) {
            var self = this

            this.featureSet = featureSetCallback( smk )
            
            smk.on( this.id, {
                'active': function ( ev ) {
                    self.featureSet.pick( ev.featureId )
                },
    
                'hover': function ( ev ) {
                    self.featureSet.highlight( ev.features && ev.features.map( function ( f ) { return f.id } ) )
                },
    
                'clear': function ( ev ) {
                    self.featureSet.clear()
                },
    
                'remove': function ( ev ) {
                    self.featureSet.remove( [ ev.featureId ] )
                },
    
                'swipe-up': function ( ev ) {
                    smk.$sidepanel.setExpand( 2 )
                },
    
                'swipe-down': function ( ev ) {
                    smk.$sidepanel.incrExpand( -1 )
                }
    
            } )
    
            // this.changedActive( function () {
                // if ( !self.active )
                    // self.featureSet.clear()
                // console.log( 'feature list active', self.active )
            // } )
    
            // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =
    
            self.featureSet.addedFeatures( function ( ev ) {
                self.active = true
    
                var ly = smk.$viewer.layerId[ ev.layerId ]
                var index = smk.$viewer.displayContext.layers.getLayerIndex( ev.layerId ) || 0
    
                self.modifyComponentProp( 'layers', function ( prop ) {
                    if ( !prop[ index ] )
                        Vue.set( prop, index, {
                            id:         ly.id,
                            title:      ly.config.title,
                            features:   []
                        } )

                    Vue.set( prop[ index ], 'features', prop[ index ].features.concat( ev.features.map( function ( ft ) {
                        if ( !self.firstId )
                            self.firstId = ft.id
        
                        return {
                            id:     ft.id,
                            title:  ft.title
                        }
                    } ) ) ) 
                } )
            } )
    
            self.featureSet.clearedFeatures( function ( ev ) {
                self.layers = []
                self.firstId = null
            } )
    
            self.featureSet.removedFeatures( function ( ev ) {
                var ly = smk.$viewer.layerId[ ev.features[ 0 ].layerId ]
                var index = smk.$viewer.displayContext.layers.getLayerIndex( ev.features[ 0 ].layerId ) || 0
    
                self.layers[ index ].features = self.layers[ index ].features.filter( function ( ft ) {
                    return ft.id != ev.features[ 0 ].id
                } )
            } )
        } )    
    }
} )
