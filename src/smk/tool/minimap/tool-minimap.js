include.module( 'tool-minimap', [ 'tool.tool-js' ], function () {
    "use strict";

    function MinimapTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
    }

    SMK.TYPE.MinimapTool = MinimapTool

    Object.assign( MinimapTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.MinimapTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat()

    return MinimapTool
} )

