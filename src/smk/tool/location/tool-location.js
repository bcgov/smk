include.module( 'tool-location', [ 
    'tool.tool-panel-js', 
    'tool-location.panel-location-html', 
    'api' 
], function ( inc ) {
    "use strict";

    Vue.component( 'location-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-location.panel-location-html' ],
        props: [ 'site', 'tool' ]
    } )

    function LocationTool( option ) {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'location-panel' )

        this.toolProp( 'site', { 
            forWidget: false,
            initial: {}
        } )
        this.toolProp( 'tool', { 
            forWidget: false,
            initial: {}
        } )

        this.showHeader = false
    }

    SMK.TYPE.LocationTool = LocationTool

    Object.assign( LocationTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LocationTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        this.geocoder = new SMK.TYPE.Geocoder( this.geocoderService )

        this.setIdentifyHandler = function ( handler ) {
            if ( !smk.$tool.identify ) return

            self.tool.identify = !!handler

            self.identifyHandler = handler || function () {}
        }
        self.identifyHandler = function () {}
        
        this.setDirectionsHandler = function ( handler ) {
            if ( !smk.$tool.directions ) return

            self.tool.directions = !!handler

            self.directionsHandler = handler || function () {}
        }
        self.directionsHandler = function () {}

        // if ( smk.$tool.measure )
        //     this.tool.measure = true

        smk.on( this.id, {
            'identify': function () {
                self.identifyHandler()
            },

            'measure': function () {
            },

            'directions': function () {
                self.directionsHandler()
            }
        } )

        smk.$viewer.handlePick( 1, function ( location ) {
            self.active = true
            self.site = location.map
            self.pickLocation( location )

            self.setDirectionsHandler()
            self.setIdentifyHandler( function () {
                self.reset()
                smk.$viewer.identifyFeatures( location )
            } )

            return self.geocoder.fetchNearestSite( location.map )
                .then( function ( site ) {
                    self.site = site

                    self.setDirectionsHandler( function () {
                        self.reset()
                        smk.$tool.directions.active = true

                        smk.$tool.directions.activating
                            .then( function () {
                                return smk.$tool.directions.startAtCurrentLocation()
                            } )
                            .then( function () {
                                return smk.$tool.directions.addWaypoint( site )
                            } )
                    } )

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
            self.setDirectionsHandler()
            self.setIdentifyHandler()
        }

        smk.$viewer.changedView( function () {
            self.reset()
        } )

        self.changedActive( function () {
            if ( !self.active )
                self.reset()
        } )
    } )

    return LocationTool
} )
