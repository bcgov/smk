include.module( 'tool-zoom', [ 'tool' ], function () {
    "use strict";

    function ZoomTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 1
        }, option ) )
    }

    SMK.TYPE.ZoomTool = ZoomTool

    $.extend( ZoomTool.prototype, SMK.TYPE.Tool.prototype )
    ZoomTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return ZoomTool

} )

