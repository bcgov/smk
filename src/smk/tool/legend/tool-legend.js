include.module( 'tool-legend', [ 
    'tool.tool-js', 
    'tool-legend.legend-html', 
    'tool-legend.legend-display-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'legend-display', {
        template: inc[ 'tool-legend.legend-display-html' ],
        props: {
            display: { type: Object },
            inGroup: { type: Boolean, default: false }
        },
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LegendTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
            // order: 3
    }

    SMK.TYPE.LegendTool = LegendTool

    $.extend( LegendTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.LegendTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        this.model = {
            contexts: []
        }

        this.vm = new Vue( {
            el: smk.addToStatus( inc[ 'tool-legend.legend-html' ] ),
            data: this.model,
        } )

        SMK.BOOT.then( function () {
            self.model.contexts = smk.$viewer.getDisplayContexts()
            smk.$viewer.setDisplayContextLegendsVisible( true )
            Vue.nextTick( function () {
                smk.$viewer.setDisplayContextLegendsVisible( false )
            } )        
        } )
    } )

    return LegendTool
} )




