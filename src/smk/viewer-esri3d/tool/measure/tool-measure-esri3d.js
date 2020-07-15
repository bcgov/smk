include.module( 'tool-measure-esri3d', [ 'tool-measure', 'esri3d', 'types-esri3d', 'util-esri3d' ], function () {
    "use strict";

    var E = SMK.TYPE.Esri3d

    SMK.TYPE.MeasureTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.changedActive( function () {
            if ( self.active ) {
                self.showStatusMessage( "Select measurement method" )
            }
            else {
            }
        } )

        function newContainer() {
            return $( '<div>' ).appendTo( self.containerEl ).get( 0 )
        }

        function destroyWidget() {
            if ( self.measureWidget )
                self.measureWidget.destroy()

            self.measureWidget = null
        }

        smk.on( this.id, {
            'container-inserted': function ( ev ) {
                console.log( ev )

                self.containerEl = ev.el

            },

            'container-unbind': function ( ev ) {
                destroyWidget()
            },

            'start-area': function ( ev ) {
                destroyWidget()
                self.showStatusMessage()

                self.measureWidget = new E.widgets.AreaMeasurement3D( {
                    view:       smk.$viewer.view,
                    container:  newContainer()
                } )
            },

            'start-distance': function ( ev ) {
                destroyWidget()
                self.showStatusMessage()

                self.measureWidget = new E.widgets.DirectLineMeasurement3D( {
                    view:       smk.$viewer.view,
                    container:  newContainer()
                } )
            },

            'cancel': function ( ev ) {
                destroyWidget()
            },

        } )

    } )

} )

