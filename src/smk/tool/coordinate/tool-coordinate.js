include.module( 'tool-coordinate', [ 'tool', 'tool-coordinate.coordinate-html' ], function ( inc ) {
    "use strict";

    function CoordinateTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 3
        }, option ) )
    }

    SMK.TYPE.CoordinateTool = CoordinateTool

    $.extend( CoordinateTool.prototype, SMK.TYPE.Tool.prototype )
    CoordinateTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.CoordinateTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

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




