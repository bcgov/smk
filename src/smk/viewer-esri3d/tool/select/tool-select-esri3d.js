include.module( 'tool-select-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'tool-select', 'feature-list-esri3d' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    SMK.TYPE.SelectTool.prototype.styleFeature = function ( override ) {
        return Object.assign( {
            strokeColor:    'blue',
            strokeWidth:    5,
            strokeOpacity:  0.9,
            fillColor:      'white',
            fillOpacity:    0.0,
        }, this.style, override )
    }

    SMK.TYPE.SelectTool.prototype.afterInitialize.push( inc[ 'feature-list-esri3d' ] )

} )
