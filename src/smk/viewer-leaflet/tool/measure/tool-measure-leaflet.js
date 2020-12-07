include.module( 'tool-measure-leaflet', [ 'leaflet', 'tool-measure', 'turf' ], function () {
    "use strict";

    SMK.TYPE.MeasureTool.addInitializer( function ( smk ) {
        var self = this

        self.viewer.leaflet = true

        smk.$viewer.map.createPane( 'hiddenPane', smk.addToContainer( '<div style="display:none"></div>' ) )

        self.showStatusMessage( "Select measurement method" )

        this.control = L.control.measure( {
            position: 'topright',
            primaryLengthUnit: 'meters',
            secondaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'hectares',
            secondaryAreaUnit: 'sqmeters',
            activeColor: '#38598a',
            completedColor: '#036',
            popupOptions: {
                pane: 'hiddenPane'
            }
        } )

        this.control.addTo( smk.$viewer.map )

        SMK.UTIL.wrapFunction( this.control, '_handleMeasureClick', function ( inner ) {
            return function ( ev ) {
                if ( self.maxPoints != null && ( this._latlngs.length + 1 ) >= self.maxPoints ) {
                    inner.call( this, ev )
                    this._handleMeasureDoubleClick()
                    return
                }

                return inner.call( this, ev )
            }
        } )

        SMK.UTIL.wrapFunction( this.control, '_handleMeasureDoubleClick', function ( inner ) {
            return function ( ev ) {
                if ( self.minPoints != null && this._latlngs.length < self.minPoints ) {
                    return
                }

                return inner.call( this, ev )
            }
        } )

        SMK.UTIL.wrapFunction( this.control, '_handleMeasureMove', function ( inner ) {
            return function ( ev ) {
                inner.call( this, ev )

                var result = {}

                var pts = this._latlngs.concat( this._measureDrag.getLatLng() ).map( function ( pt ) { return [ pt.lng, pt.lat ] } )
                result.count = pts.length

                if ( pts.length > 2 ) {
                    var poly = pts.concat( [ pts[ 0 ] ] )
                    result.area = turf.area( turf.polygon( [ poly ] ) )
                    result.length = turf.length( turf.lineString( poly ), { units: 'meters' } )
                }
                else if ( pts.length > 1 ) {
                    result.length = turf.length( turf.lineString( pts ), { units: 'meters' } )
                }
                // console.log( pts )
                displayResult( result )
            }
        } )

        smk.$viewer.map.on( {
            'measurefinish': function ( ev ) {
                self.busy = false
                displayResult( {
                    count:  ev.pointCount,
                    area:   ev.area,
                    length: ev.length,
                } )
            }
        } )

        function displayResult( res ) {
            self.results = []

            if ( !res.count ) return

            if ( res.count > 2 ) {
                self.showStatusMessage()
                self.results.push( {
                    title:  'Number of edges',
                    value:  res.count,
                    // unit:   'vertices'
                } )

                if ( res.area )
                    self.results.push( {
                        title:  'Area',
                        value:  res.area,
                        dim:    2
                    } )

                if ( res.length )
                    self.results.push( {
                        title:  'Perimeter',
                        value:  res.length,
                        dim:    1
                    } )
            }
            else if ( res.count > 1 ) {
                self.showStatusMessage()
                self.results.push( {
                    title:  'Length',
                    value:  res.length,
                    dim:    1
                } )
            }
        }

        this.changedActive( function () {
            if ( self.active ) {
                self.control._layer.addTo( smk.$viewer.map )
            }
            else {
                self.control._layer.removeFrom( smk.$viewer.map )
            }
        } )

        smk.on( this.id, {
            'start-area': function ( ev ) {
                self.busy = true
                self.control._layer.clearLayers()
                self.results = []
                self.showStatusMessage( "Click on map to set first point", 'progress' )

                self.minPoints = 3
                self.maxPoints = null

                self.control._startMeasure()
            },

            'start-distance': function ( ev ) {
                self.busy = true
                self.control._layer.clearLayers()
                self.results = []
                self.showStatusMessage( "Click on map to set starting point", 'progress' )

                self.minPoints = 2
                self.maxPoints = 2

                self.control._startMeasure()
            },

            'cancel': function ( ev ) {
                self.busy = false
                self.results = []
                self.showStatusMessage( "Select measurement method" )

                self.control._finishMeasure()
            },

        } )

    } )

} )

