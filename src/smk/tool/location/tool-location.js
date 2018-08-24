include.module( 'tool-location', [ 'tool', 'widgets', 'tool-location.popup-location-html', 'tool-location.panel-location-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'location-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-location.panel-location-html' ],
        props: [ 'site', 'tool' ]
    } )

    function LocationTool( option ) {
        this.makeProp( 'site', {} )
        this.makeProp( 'tool', {} )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title:      'Location',
            showPanel:  false
        }, option ) )

        if ( this.showPanel )
            this.panelComponent = 'location-panel'
    }


    SMK.TYPE.LocationTool = LocationTool

    $.extend( LocationTool.prototype, SMK.TYPE.Tool.prototype )
    LocationTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LocationTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        if ( smk.$tool.identify )
            this.tool.identify = true

        // if ( smk.$tool.measure )
        //     this.tool.measure = true

        if ( smk.$tool.directions )
            this.tool.directions = true

        smk.on( this.id, {
            'identify': function () {
                self.reset()
                smk.$viewer.identifyFeatures( self.location )
            },

            'measure': function () {
            },

            'directions': function () {
                var site = self.site
                self.reset()
                smk.$tool.directions.active = true

                smk.$tool.directions.activating
                    .then( function () {
                        return smk.$tool.directions.startAtCurrentLocation()
                    } )
                    .then( function () {
                        return smk.$tool.directions.addWaypoint( site )
                    } )
            }
        } )

        if ( !this.showPanel )
            this.vm = new Vue( {
                el: smk.addToOverlay( inc[ 'tool-location.popup-location-html' ] ),
                data: this.widget,
                methods: {
                    formatDD: function ( dd ) {
                        return dd.toFixed( 4 )
                    },
                    identifyFeatures: function () {
                        self.reset()
                        smk.$viewer.identifyFeatures( self.location )
                    },
                    startMeasurement: function () {

                    },
                    startDirections: function () {
                        var site = self.site
                        self.reset()
                        smk.$tool.directions.active = true

                        smk.$tool.directions.activating
                            .then( function () {
                                return smk.$tool.directions.startAtCurrentLocation()
                            } )
                            .then( function () {
                                return smk.$tool.directions.addWaypoint( site )
                            } )
                    },
                },
                updated: function () {
                    if ( self.visible )
                        self.updatePopup()
                }
            } )

        this.updatePopup = function () {}

        smk.$viewer.handlePick( 1, function ( location ) {
            self.reset()

            self.location = location
            self.active = true

            return SMK.UTIL.findNearestSite( location.map )
                .then( function ( site ) {
                    self.site = site
                    return true
                } )
                .catch( function ( err ) {
                    self.site = location.map
                    return true
                } )
        } )

        this.reset = function () {
            this.site = {}
            this.active = false
            this.visible = false
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
