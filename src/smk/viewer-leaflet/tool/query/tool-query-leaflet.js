include.module( 'tool-query-leaflet', [
    'leaflet',
    'tool-query',
    'tool-leaflet',
    'tool-leaflet.tool-feature-list-clustering-leaflet-js'
], function ( inc ) {
    "use strict";

    SMK.TYPE.QueryResultsTool.addInitializer( function () {
        this.styleFeature = function () {
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
    } )

    SMK.TYPE.QueryResultsTool.addInitializer( inc[ 'tool-leaflet.tool-feature-list-clustering-leaflet-js' ] )
} )
