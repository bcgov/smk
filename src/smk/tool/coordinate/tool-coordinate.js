include.module( 'tool-coordinate', [ 'tool.tool-js', 'tool-coordinate.coordinate-html' ], function ( inc ) {
    "use strict";

    function CoordinateTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
    }

    SMK.TYPE.CoordinateTool = CoordinateTool

    Object.assign( CoordinateTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.CoordinateTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        if ( smk.$device == 'mobile' ) return

        this.model = {
            latitude: null,
            longitude: null,
        }

        this.vm = new Vue( {
            el: smk.addToStatus( inc[ 'tool-coordinate.coordinate-html' ] ),
            data: this.model,
        } )

        smk.$viewer.changedLocation( function ( ev ) {
            if ( ev.map && ev.map.latitude ) {
                self.model.latitude = ev.map.latitude
                self.model.longitude = ev.map.longitude
            }
            else {
                self.model.latitude = null
                self.model.longitude = null
            }
        } )
    } )

    return CoordinateTool
} )




