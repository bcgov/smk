include.module( 'tool-coordinate', [ 'tool.tool-js', 'tool-coordinate.coordinate-html' ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'CoordinateTool',
        null,
        function ( smk ) {
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
        } 
    )
} )
