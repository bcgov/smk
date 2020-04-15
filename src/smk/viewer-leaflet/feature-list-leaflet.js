include.module( 'feature-list-leaflet', [ 
    'leaflet', 
    'tool.tool-panel-feature-list-js', 
], function ( inc ) {
    "use strict";

    return function ( smk ) {
        var self = this

        this.highlight = {}
        this.featureHighlights = L.layerGroup( { pane: 'markerPane' } )

        self.changedActive( function () {
            self.visible = self.active
        } )

        self.changedVisible( function () {
            if ( self.visible ) {
                self.featureHighlights.addTo( smk.$viewer.map )
            }
            else {
                smk.$viewer.map.removeLayer( self.featureHighlights )
            }
        } )

        self.featureSet.pickedFeature( function ( ev ) {
            if ( ev.was ) {
                showHighlight( ev.was.id, false )
            }

            if ( ev.feature ) {
                showHighlight( ev.feature.id, true )
            }
        } )

        self.featureSet.highlightedFeatures( function ( ev ) {
            if ( ev.features )
                ev.features.forEach( function ( f ) {
                    showHighlight( f.id, true )
                } )

            if ( ev.was )
                ev.was.forEach( function ( f ) {
                    if ( f && f.id )
                        showHighlight( f.id, self.featureSet.isPicked( f.id ) )
                } )
        } )

        self.featureSet.clearedFeatures( function ( ev ) {
            self.featureHighlights.clearLayers()
            self.highlight = {}
        } )

        self.featureSet.removedFeatures( function ( ev ) {
            ev.features.forEach( function ( ft ) {
                if ( self.featureSet.isPicked( ft.id ) )
                    self.featureSet.pick( null )

                self.featureHighlights.removeLayer( self.highlight[ ft.id ] )
                delete self.highlight[ ft.id ]
            } )
        } )

        function showHighlight( id, show ) {
            var hl = self.highlight[ id ]
            if ( !hl ) return

            if ( show ) {
                self.featureHighlights.addLayer( hl )
            }
            else {
                self.featureHighlights.removeLayer( hl )
            }
        }
    }

} )
