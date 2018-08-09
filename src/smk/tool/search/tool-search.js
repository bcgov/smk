include.module( 'tool-search', [ 'tool', 'widgets', 'tool-search.widget-search-html', 'tool-search.panel-search-html', 'tool-search.popup-search-html' ], function ( inc ) {
    "use strict";

    var request

    function doAddressSearch( text ) {
        if ( request )
            request.abort()

        var query = {
            ver:            1.2,
            maxResults:     20,
            outputSRS:      4326,
            addressString:  text,
            autoComplete:   true
        }

        return SMK.UTIL.resolved()
            .then( function () {
                return ( request = $.ajax( {
                    timeout:    10 * 1000,
                    dataType:   'jsonp',
                    url:        'https://apps.gov.bc.ca/pub/geocoder/addresses.geojsonp',
                    data:       query,
                } ) )
            } )
            .then( function ( data ) {
                return $.map( data.features, function ( feature ) {
                    if ( !feature.geometry.coordinates ) return;

                    // exclude whole province match
                    if ( feature.properties.fullAddress == 'BC' ) return;

                    return feature
                } )
            } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'search-widget', {
        mixins: [ inc.widgets.emit ],
        template: inc[ 'tool-search.widget-search-html' ],
        props: [ 'id', 'type', 'title', 'visible', 'enabled', 'active', 'icon', 'type', 'initialSearch' ],
        data: function () {
            return {
                search: null
            }
        },
        watch: {
            initialSearch: function () {
                this.search = null
            }
        },
        computed: {
            classes: function () {
                var c = {}
                c[ 'smk-' + this.type + '-tool' ] = true
                return Object.assign( c, {
                    'smk-tool-active': this.active,
                    'smk-tool-visible': this.visible,
                    'smk-tool-enabled': this.enabled
                } )
            }
        },
        methods: {
            focus: function () {
                if ( !this.active )
                    this.$refs[ 'search-input' ].focus()
            }
        }
    } )

    Vue.component( 'search-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-search.panel-search-html' ],
        props: [ 'busy', 'results', 'highlightId' ],
        methods: {
            isEmpty: function () {
                return !this.results || this.results.length == 0
            }
        },
        data: function () {
            return {
                search: null
            }
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function SearchTool( option ) {
        this.makePropWidget( 'icon', 'search' )
        this.makePropWidget( 'initialSearch', 0 )
        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'results', [] )
        this.makePropPanel( 'highlightId', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:      2,
            title:      'Search',
            widgetComponent: 'search-widget',
            panelComponent: 'search-panel',
        }, option ) )
    }

    SMK.TYPE.SearchTool = SearchTool

    $.extend( SearchTool.prototype, SMK.TYPE.Tool.prototype )
    SearchTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SearchTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function ( ev ) {
                if ( !self.visible || !self.enabled ) return

                if ( ev.toggle )
                    self.active = !self.active
                else
                    self.active = true
            },

            'input-change': function ( ev ) {
                smk.$viewer.searched.clear()

                self.busy = true
                doAddressSearch( ev.text )
                    .then( function ( features ) {
                        self.active = true
                        smk.$viewer.searched.add( 'search', features, 'fullAddress' )
                        self.busy = false
                    } )
                    .catch( function ( e ) {
                        console.warn( 'search failure:', e )
                    } )
            },

            'hover': function ( ev ) {
                smk.$viewer.searched.highlight( ev.result ? [ ev.result.id ] : [] )
            },

            'pick': function ( ev ) {
                smk.$viewer.searched.pick( null )
                smk.$viewer.searched.pick( ev.result.id )
            },

            'clear': function ( ev ) {
                smk.$viewer.searched.clear()
                self.initialSearch += 1
            }
        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        smk.$viewer.searched.addedFeatures( function ( ev ) {
            self.results = ev.features
        } )

        // // smk.$viewer.selected.removedFeatures( function ( ev ) {
        // // } )

        smk.$viewer.searched.pickedFeature( function ( ev ) {
            self.highlightId = ev.feature && ev.feature.id

            self.popupModel.feature = ev.feature
        } )

        // // smk.$viewer.selected.highlightedFeatures( function ( ev ) {
        // // } )

        smk.$viewer.searched.clearedFeatures( function ( ev ) {
            self.results = []
        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        this.popupModel = {
            feature: null,
            tool: {}
        }

        if ( smk.$tool.directions )
            this.popupModel.tool.directions = true

        this.popupVm = new Vue( {
            el: smk.addToContainer( inc[ 'tool-search.popup-search-html' ] ),
            data: self.popupModel,
            methods: {
                directionsToFeature: function ( feature ) {
                    smk.$tool.directions.active = true

                    smk.$tool.directions.activating
                        .then( function () {
                            return smk.$tool.directions.startAtCurrentLocation()
                        } )
                        .then( function () {
                            return SMK.UTIL.findNearestSite( { latitude: feature.geometry.coordinates[ 1 ], longitude: feature.geometry.coordinates[ 0 ] } )
                                .then( function ( site ) {
                                    return smk.$tool.directions.addWaypoint( site )
                                } )
                                .catch( function ( err ) {
                                    console.warn( err )
                                    return smk.$tool.directions.addWaypoint()
                                } )
                        } )
                },
            },
            updated: function () {
                if ( this.feature )
                    self.updatePopup()
            }
        } )

        this.updatePopup = function () {}
    } )

    return SearchTool

} )

