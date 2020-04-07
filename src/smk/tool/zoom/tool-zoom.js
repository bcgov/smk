include.module( 'tool-zoom', [ 'tool.tool-js' ], function () {
    "use strict";

    function ZoomTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
    }

    SMK.TYPE.ZoomTool = ZoomTool

    Object.assign( ZoomTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ZoomTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat()

    return ZoomTool
} )

