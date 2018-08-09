include.module( 'tool-pan', [ 'tool' ], function () {
    "use strict";

    function PanTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
        }, option ) )
    }

    SMK.TYPE.PanTool = PanTool

    $.extend( PanTool.prototype, SMK.TYPE.Tool.prototype )
    PanTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return PanTool

} )

