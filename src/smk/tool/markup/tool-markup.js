include.module( 'tool-markup', [ 'tool.tool-js' ], function () {
    "use strict";

    function MarkupTool() {
        SMK.TYPE.Tool.prototype.constructor.call( this )
    }

    SMK.TYPE.MarkupTool = MarkupTool

    Object.assign( MarkupTool.prototype, SMK.TYPE.Tool.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    MarkupTool.prototype.afterInitialize = SMK.TYPE.Tool.prototype.afterInitialize.concat()

    return MarkupTool
} )

