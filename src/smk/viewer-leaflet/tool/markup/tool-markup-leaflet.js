include.module( 'tool-markup-leaflet', [ 'leaflet', 'tool-markup' ], function () {
    "use strict";

    SMK.TYPE.MarkupTool.prototype.afterInitialize.push( function ( smk ) {
        smk.$viewer.map.pm.addControls( {
            position: 'topright', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
            drawMarker: true,  // adds button to draw markers
            drawPolygon: true,  // adds button to draw a polygon
            drawPolyline: true,  // adds button to draw a polyline
            drawCircle: true,  // adds button to draw a cricle
            editPolygon: true,  // adds button to toggle global edit mode
            deleteLayer: true   // adds a button to delete layers
        } )
    } )

} )
