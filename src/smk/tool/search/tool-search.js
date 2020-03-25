include.module( 'tool-search', [ 'tool', 'sidepanel', 'widgets', 'tool-search.widget-search-html', 'tool-search.panel-search-html' ], function ( inc ) {
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
                var inp = this.$refs[ 'search-input' ]
                if ( !this.active )
                    inp.focus()
                    inp.setSelectionRange( 0, 0 )
                    inp.setSelectionRange( 0, inp.value.length )
            }
        }
    } )

    Vue.component( 'search-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-search.panel-search-html' ],
        props: [ 'results', 'highlightId' ],
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
        this.makePropWidget( 'icon' ) //, 'search' )
        this.makePropWidget( 'initialSearch', 0 )

        this.makePropPanel( 'results', [] )
        this.makePropPanel( 'highlightId', null )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            // order:      2,
            // position:       'toolbar',
            // title:      'Search for Location',
            widgetComponent: 'search-widget',
            panelComponent: 'search-panel',
        }, option ) )
    }

    SMK.TYPE.SearchTool = SearchTool

    $.extend( SearchTool.prototype, SMK.TYPE.PanelTool.prototype )
    SearchTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SearchTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.$container.classList.add( 'smk-tool-search' )

        smk.on( this.id, {
            'activate': function ( ev ) {
                if ( !self.enabled ) return

                if ( ev.toggle )
                    self.active = !self.active
                else
                    self.active = true
            },

            'input-change': function ( ev ) {
                smk.$viewer.searched.clear()

                self.busy = true
                self.title = 'Locations matching <wbr>"' + ev.text + '"'
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
        } )

        // // smk.$viewer.selected.highlightedFeatures( function ( ev ) {
        // // } )

        smk.$viewer.searched.clearedFeatures( function ( ev ) {
            self.results = []
        } )

    } )

    return SearchTool

} )

