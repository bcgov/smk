include.module( 'tool.tool-widget-js', [ 'tool.tool-base-js', 'tool.tool-widget-html' ], function ( inc ) {
    "use strict";

    SMK.COMPONENT.ToolWidget = { 
        extends: SMK.COMPONENT.ToolBase,
        template: inc[ 'tool.tool-widget-html' ],
        props: { 
            showWidget: Boolean,
            showTitle:  Boolean,
            icon:       String
        },
        computed: {
            classes: function () {
                var c = this.baseClasses
                c[ 'smk-tool-title' ] = this.showTitle
                return c
            }
        }
    } 
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.ToolWidget = function ( componentName ) {       
        var self = this

        this.defineProp( 'showWidget' )
        this.defineProp( 'showTitle' )
        this.defineProp( 'icon' )

        this.showWidget = true
        this.showTitle = false
        this.icon = 'widgets'

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

