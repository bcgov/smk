include.module( 'tool-query-esri3d', [ 'esri3d', 'types-esri3d', 'util-esri3d', 'tool-query', 'feature-list-esri3d' ], function ( inc ) {
    "use strict";

    var E = SMK.TYPE.Esri3d

    SMK.TYPE.QueryTool.prototype.styleFeature = function ( override ) {
        return Object.assign( {
            strokeColor:    'black',
            strokeWidth:    5,
            strokeOpacity:  0.9,
            fillColor:      'white',
            fillOpacity:    0.5,
        }, this.style, override )
    }

    SMK.TYPE.QueryTool.prototype.afterInitialize.push( inc[ 'feature-list-esri3d' ] )

} )
