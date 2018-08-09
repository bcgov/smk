include.module( 'toolbar', [ 'vue', 'toolbar.toolbar-html' ], function ( inc ) {
    "use strict";

    function Toolbar( smk ) {
        var self = this

        this.model = {
            tools: [],
        }

        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'toolbar.toolbar-html' ] ),
            data: this.model,
            methods: {
                trigger: function ( toolId, event, arg ) {
                    smk.emit( toolId, event, arg )
                }
            }
        } )
    }

    Toolbar.prototype.add = function ( tool ) {
        this.model.tools.push( {
            id: tool.id,
            type: tool.type,
            widgetComponent: tool.widgetComponent,
            widget: tool.widget
        } )
    }

    SMK.TYPE.Toolbar = Toolbar

    return Toolbar

} )