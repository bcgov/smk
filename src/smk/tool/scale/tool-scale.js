include.module( 'tool-scale', [ 'tool.tool-js', 'tool-scale.scale-html' ], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.define( 'ScaleTool',
        function () {
            this.defineProp( 'showFactor' )
            this.defineProp( 'showBar' )
            this.defineProp( 'showZoom' )
        },
        function ( smk ) {
            var self = this

            this.model = {
                scaleDenom: null,
                rulerSectionWidth: null,
                rulerLength: null,
                rulerUnit: null,
                zoomLevel: null
            }

            this.vm = new Vue( {
                el: smk.addToStatus( inc[ 'tool-scale.scale-html' ] ),
                data: this.model,
            } )

            smk.$viewer.changedView( function ( ev ) {
                self.refresh()
            } )

            this.refresh = function () {
                this.model.scaleDenom = null
                this.model.rulerSectionWidth = null
                this.model.rulerLength = null

                var view = smk.$viewer.getView()
                if ( !view ) return

                if ( this.showFactor !== false && view.scale ) {
                    this.model.scaleDenom = view.scale
                }

                if ( this.showZoom !== false  ) {
                    this.model.zoomLevel = view.zoom
                }

                if ( this.showBar !== false && view.metersPerPixel ) {
                    var rulerMM = rounded( 200 * view.metersPerPixel * 1000 )
                    this.model.rulerSectionWidth = rulerMM / 1000 / view.metersPerPixel / 4

                    var dist = appropriateUnit( rulerMM )
                    this.model.rulerLength = dist.value
                    this.model.rulerUnit = dist.unit
                }
            }

            var firstDigit = [ null, 1, 2, 3, 5, 5, 5, 5, 10, 10 ]

            function rounded( s ) {
                var f = firstDigit[ 1 * ( s + '' )[ 0 ] ]

                return f * Math.pow( 10, ( Math.floor( s ) + '' ).length - 1 )
            }

            function appropriateUnit( mm ) {
                if ( mm <= 500 * 1000 ) return { value: mm / 1000, unit: 'm' }
                return { value: mm / 1000 / 1000, unit: 'km' }
            }

            self.refresh()
        }
    )
} )




