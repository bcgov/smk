include.module( 'tool-search-location', [ 'tool', 'widgets', 
    'tool-search-location.panel-search-location-html', 
    'tool-search-location.location-title-html', 
    'tool-search-location.location-address-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'search-location-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-search-location.panel-search-location-html' ],
        props: [ 'feature', 'tool', 'locationComponent' ]
    } )

    function SearchLocationTool( option ) {
        var self = this 

        this.makeProp( 'feature', {} )
        this.makeProp( 'tool', {} )

        this.makePropPanel( 'locationComponent', {} )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            title: 'Search Location',
            panelComponent: 'search-location-panel',
            titleComponent: function () {
                return self.titleComp
            }
        }, option ) )
    }

    SMK.TYPE.SearchLocationTool = SearchLocationTool

    $.extend( SearchLocationTool.prototype, SMK.TYPE.Tool.prototype )
    SearchLocationTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SearchLocationTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        self.changedActive( function () {
            if ( self.active ) {
                smk.$viewer.searched.highlight()
            }
            else {
                smk.$viewer.searched.pick()
            }
        } )

        if ( smk.$tool.directions )
            this.tool.directions = true

        smk.on( this.id, {
            'directions': function () {
                smk.$tool.directions.active = true

                smk.$tool.directions.activating
                    .then( function () {
                        return smk.$tool.directions.startAtCurrentLocation()
                    } )
                    .then( function () {
                        return SMK.UTIL.findNearestSite( { latitude: self.feature.geometry.coordinates[ 1 ], longitude: self.feature.geometry.coordinates[ 0 ] } )
                            .then( function ( site ) {
                                return smk.$tool.directions.addWaypoint( site )
                            } )
                            .catch( function ( err ) {
                                console.warn( err )
                                return smk.$tool.directions.addWaypoint()
                            } )
                    } )
            }
        } )

        smk.$viewer.searched.pickedFeature( function ( ev ) {
            self.locationComponent = {
                name: 'location',
                template: inc[ 'tool-search-location.location-address-html' ],
                data: function () { 
                    return {
                        feature: ev.feature
                    }
                }
            }

            self.titleComp = {
                name: 'location-title',
                template: inc[ 'tool-search-location.location-title-html' ],
                data: function () { 
                    return Object.assign( { intersectionName: null }, ev.feature.properties )
                }
            }

            if ( ev.feature ) {
                self.active = true
            }
        } )

    } )

    return SearchLocationTool
} )
