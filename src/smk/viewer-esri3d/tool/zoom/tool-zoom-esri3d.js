include.module( 'tool-zoom-esri3d', [ 'tool-zoom', 'esri3d' ], function () {
    "use strict";

    SMK.TYPE.ZoomTool.prototype.afterInitialize.push( function ( smk ) {
        if ( smk.$device == 'mobile' ) return

        if ( this.mouseWheel !== false ) {
            smk.$viewer.zoomHandler.mouseWheel.remove()
        }

        if ( this.doubleClick !== false ) {
            smk.$viewer.zoomHandler.doubleClick1.remove()
            smk.$viewer.zoomHandler.doubleClick2.remove()
        }

        if ( this.box !== false ) {
            smk.$viewer.zoomHandler.drag1.remove()
            smk.$viewer.zoomHandler.drag2.remove()
        }

        if ( this.control !== false ) {
            smk.$viewer.zoomHandler.keyDown.remove()
            smk.$viewer.view.ui.add( [
                {
                    component: new SMK.TYPE.Esri3d.widgets.Zoom( { view: smk.$viewer.view } ),
                    position: 'top-right'
                }
            ] )
        }
    } )

} )

