include.module( 'tool.tool-panel-js', [ 
    'tool.tool-base-js'
    // 'component' 
], function ( inc ) {
    "use strict";

    SMK.TYPE.ToolPanel = function ( componentName ) {
        var self = this

        this.defineProp( 'showPanel' )
        this.defineProp( 'showHeader' )
        this.defineProp( 'showSwipe' )
        this.defineProp( 'expand' )
        this.defineProp( 'hasPrevious' )

        this.showPanel = true
        this.showHeader = true
        this.showSwipe = false
        this.expand = 0
        this.hasPrevious = false

        this.$propFilter.classes = false

        this.makePanelComponent = function () {
            return {
                component: componentName,
                prop: self.getComponentProps( componentName )    
            }
        }        
    }
} )

