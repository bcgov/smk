include.module( 'tool-pan', [ 'tool.tool-js' ], function () {
    "use strict";

    function PanTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
    }

    SMK.TYPE.PanTool = PanTool

    Object.assign( PanTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    PanTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat()

    return PanTool
} )

