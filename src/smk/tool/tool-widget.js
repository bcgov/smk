include.module( 'tool.tool-widget-js', [ 'tool.tool-js', 'tool.tool-widget-html' ], function ( inc ) {
    "use strict";

    SMK.COMPONENT.ToolWidget = { 
        extends: SMK.COMPONENT.Tool,
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
    function ToolWidget( widget ) {
        this.widget = { 
            component: widget,
            prop: {} 
        }

        SMK.TYPE.Tool.prototype.constructor.call( this )

        this.toolProp( 'showWidget', {
            initial: true,
            forPanel: false
        } )
        this.toolProp( 'showTitle', { 
            initial: false
        } )
        this.toolProp( 'icon', { 
            forPanel: false
        } )
    }

    SMK.TYPE.ToolWidget = ToolWidget

    Object.assign( ToolWidget.prototype, SMK.TYPE.Tool.prototype )

    ToolWidget.prototype.afterInitialize = [
        function ( smk ) {
            var self = this
    
            smk.on( this.id, {
                'activate': function () {
                    if ( !self.enabled ) return
    
                    self.active = !self.active
                }
            } )
        }
    ]

    ToolWidget.prototype._setProp = function ( name, val, opt ) {
        SMK.TYPE.Tool.prototype._setProp.call( this, name, val, opt )
        if ( opt.forWidget !== false ) this.widget.prop[ name ] = val
    }
} )

