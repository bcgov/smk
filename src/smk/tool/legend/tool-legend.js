include.module( 'tool-legend', [ 'tool', 'tool-legend.legend-html', 'tool-legend.legend-display-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'legend-display', {
        template: inc[ 'tool-legend.legend-display-html' ],
        props: {
            id:      { type: String },
            display: { type: Object },
            glyph:   { type: Object },
            inGroup: { type: Boolean, default: false }
        },
        // mixins: [ inc.widgets.emit ],
    } )

    Vue.component( 'legend-panel', {
        // extends: inc.widgets.toolPanel,
        template: inc[ 'tool-legend.legend-html' ],
        props: [ 'display' ], //, 'allVisible', 'glyph', 'command', 'filter', 'legend' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LegendTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 3
        }, option ) )
    }

    SMK.TYPE.LegendTool = LegendTool

    $.extend( LegendTool.prototype, SMK.TYPE.Tool.prototype )
    LegendTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.LegendTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        // if ( smk.$device == 'mobile' ) return

        this.model = {
            display: {}
            // latitude: null,
            // longitude: null,
        }

        this.vm = new Vue( {
            el: smk.addToStatus( inc[ 'tool-legend.legend-html' ] ),
            data: this.model,
        } )

        SMK.BOOT.then( function () {
            self.model.display = smk.$viewer.getLayerDisplayItems()
        } )
        // smk.$viewer.changedLocation( function ( ev ) {
        //     if ( ev.map && ev.map.latitude ) {
        //         self.model.latitude = ev.map.latitude
        //         self.model.longitude = ev.map.longitude
        //     }
        //     else {
        //         self.model.latitude = null
        //         self.model.longitude = null
        //     }
        // } )
    } )

    return LegendTool
} )




