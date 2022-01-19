include.module( 'tool-location', [
    'tool.tool-base-js',
    'tool.tool-panel-js',
    'tool-location.panel-location-html',
    'api'
], function ( inc ) {
    "use strict";

    Vue.component( 'location-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-location.panel-location-html' ],
        props: [ 'site', 'tool' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'LocationTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'location-panel' )

            this.defineProp( 'site' )
            this.defineProp( 'tool' )

            this.site = {}
            this.tool = {}
        },
        function ( smk ) {
            var self = this

            smk.getSidepanel().addTool( this, smk )

            this.geocoder = new SMK.TYPE.Geocoder( this.geocoderService )

            smk.$viewer.handlePick( 1, function ( location ) {
                self.active = true
                self.site = location.map
                self.pickLocation( location )

                return self.geocoder.fetchNearestSite( location.map )
                    .then( function ( site ) {
                        self.site = site

                        return true
                    } )
                    .catch( function ( err ) {
                        return true
                    } )
            } )

            this.pickLocation = function ( location ) {}

            this.reset = function () {
                this.site = {}
                this.active = false
            }

            smk.$viewer.changedView( function () {
                self.reset()
            } )

            self.changedActive( function () {
                if ( !self.active )
                    self.reset()
            } )
        }
    )
} )
