include.module( 'tool-query-leaflet', [ 'leaflet', 'tool-query', 'feature-list-clustering-leaflet' ], function ( inc ) {
    "use strict";

    SMK.TYPE.QueryTool.prototype.styleFeature = function () {
        var self = this
        return function () {
            return Object.assign( {
                color:       'black',
                weight:      3,
                opacity:     0.8,
                fillColor:   'white',
                fillOpacity: 0.5,
            }, self.style )
        }
    }

    SMK.TYPE.QueryTool.prototype.afterInitialize.push( inc[ 'feature-list-clustering-leaflet' ] )

} )
