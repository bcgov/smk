include.module( 'tool-query-place-leaflet', [ 'leaflet', 'tool-query-place', 'feature-list-clustering-leaflet' ], function ( inc ) {
    "use strict";

    SMK.TYPE.QueryPlaceTool.prototype.styleFeature = function () {
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

    SMK.TYPE.QueryPlaceTool.prototype.afterInitialize.push( inc[ 'feature-list-clustering-leaflet' ] )

} )
