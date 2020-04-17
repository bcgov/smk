include.module( 'tool.tool-widget-js', [ 
    'tool.tool-base-js'
    // 'component' 
], function ( inc ) {
    "use strict";

    SMK.TYPE.ToolWidget = function ( componentName ) {       
        var self = this

        this.defineProp( 'showWidget' )

        this.showWidget = true

        this.makeWidgetComponent = function () {
            return {
                component: componentName,
                prop: self.getComponentProps( componentName )    
            }
        }        

        this.$propFilter.classes = false

        this.$initializers.push( function ( smk ) {
            var self = this
    
            smk.on( this.id, {
                'activate': function () {
                    if ( !self.enabled ) return
    
                    self.active = !self.active
                }
            } )
        } )
    }
} )

