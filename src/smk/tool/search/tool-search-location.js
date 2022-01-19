include.module( 'tool-search.tool-search-location-js', [
    'tool.tool-panel-js',
    'tool-search.panel-search-location-html',
    'tool-search.location-title-html',
    'tool-search.location-address-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'search-location-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-search.panel-search-location-html' ],
        props: [ 'feature', 'tool', 'command', 'locationComponent' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'SearchLocationTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'search-location-panel' )

            this.defineProp( 'feature' )
            this.defineProp( 'tool' )
            this.defineProp( 'command' )
            this.defineProp( 'locationComponent' )

            this.feature = {}
            this.tool = {}
            this.command = {}
            this.locationComponent = {}
            this.parentId = 'SearchListTool'
        },
        function ( smk ) {
            var self = this

            this.tool = smk.getToolTypesAvailable()

            self.changedActive( function () {
                if ( self.active ) {
                    smk.$viewer.searched.highlight()
                }
                else {
                    smk.$viewer.searched.pick()
                }
            } )

            smk.$viewer.searched.pickedFeature( function ( ev ) {
                self.locationComponent = {
                    name: 'location',
                    template: inc[ 'tool-search.location-address-html' ],
                    data: function () {
                        return {
                            feature: ev.feature
                        }
                    }
                }

                self.titleComp = {
                    name: 'location-title',
                    template: inc[ 'tool-search.location-title-html' ],
                    data: function () {
                        return Object.assign( { intersectionName: null }, ev.feature.properties )
                    }
                }

                if ( ev.feature && self.showLocation ) {
                    self.active = true
                }
            } )
        }
    )
} )
