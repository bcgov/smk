include.module( 'tool-markup', [ 'tool' ], function () {
    "use strict";

    function MarkupTool( option ) {
        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order: 3
        }, option ) )
    }

    SMK.TYPE.MarkupTool = MarkupTool

    $.extend( MarkupTool.prototype, SMK.TYPE.Tool.prototype )
    MarkupTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return MarkupTool

} )

