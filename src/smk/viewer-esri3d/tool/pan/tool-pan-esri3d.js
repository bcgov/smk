include.module( 'tool-pan-esri3d', [ 'tool-pan', 'esri3d' ], function () {
    "use strict";

    SMK.TYPE.PanTool.prototype.afterInitialize.push( function ( smk ) {
        smk.$viewer.view.ui.add( [
            {
                component: new SMK.TYPE.Esri3d.widgets.NavigationToggle( { view: smk.$viewer.view } ),
                position: 'top-right'
            },
            {
                component: new SMK.TYPE.Esri3d.widgets.Compass( { view: smk.$viewer.view } ),
                position: 'top-right'
            }
        ] )

        smk.$viewer.panHandler.drag.remove()
        smk.$viewer.panHandler.keyDown.remove()
    } )

} )

