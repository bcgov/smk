include.module( 'tool-baseMaps', [ 'tool', 'widgets', 'viewer', 'leaflet', 'tool-baseMaps.panel-base-maps-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'baseMaps-widget', {
        extends: inc.widgets.toolButton,
        props: [ 'status' ],
        computed: {
            classes: function () {
                var c = {
                    'smk-tool': true,
                    'smk-tool-active': this.active,
                    'smk-tool-visible': this.visible,
                    'smk-tool-enabled': this.enabled,
                    'smk-tool-title': this.showTitle
                }
                c[ 'smk-' + this.id + '-tool' ] = true

                if ( this.status )
                    c[ 'smk-' + this.status ] = true
                
                return c
            }
        },
    } )

    Vue.component( 'baseMaps-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-baseMaps.panel-base-maps-html' ],
        props: [ 'current', 'basemaps', 'mapStyle' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BaseMapsTool( option ) {
        this.makePropWidget( 'icon', null ) //'map' )
        this.makePropWidget( 'status', null ) 
        
        this.makePropPanel( 'current', null )
        this.makePropPanel( 'basemaps', [] )
        this.makePropPanel( 'mapStyle', {
            width: '110px',
            height: '110px',
        } )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            // order:          3,
            // position:       'menu',
            // title:          'Base Maps',
            widgetComponent:'baseMaps-widget',
            panelComponent: 'baseMaps-panel',
            choices:        null
        }, option ) )
    }

    SMK.TYPE.BaseMapsTool = BaseMapsTool

    $.extend( BaseMapsTool.prototype, SMK.TYPE.Tool.prototype )
    BaseMapsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    BaseMapsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.basemaps = Object.keys( smk.$viewer.basemap )
            .map( function ( id ) {
                return Object.assign( { id: id }, smk.$viewer.basemap[ id ] )
            } )
            .filter( function ( bm ) {
                if ( !self.choices || self.choices.length == 0 ) return true
                if ( self.choices.indexOf( bm.id ) > -1 ) return true
                if ( smk.viewer.baseMap == bm.id ) return true

                return false
            } )
            .sort( function ( a, b ) { return a.order - b.order } )
            .map( function ( bm ) {
                var m

                bm.create = function ( el ) {
                    m = L.map( el, {
                        attributionControl: false,
                        zoomControl: false,
                        dragging: false,
                        keyboard: false,
                        scrollWheelZoom: false,
                        zoom: 10,
                        zoomSnap: 0
                    } );

                    var bmLayers = smk.$viewer.createBasemapLayer( bm.id )
                    m.addLayer( bmLayers[ 0 ] )
                }

                bm.update = function () {
                    var v = smk.$viewer.getView()
                    m.setView( [ v.center.latitude, v.center.longitude ], v.zoom )
                }

                return bm
            } ) 

        this.current = smk.viewer.baseMap

        this.changedActive( function () {
            if ( !self.active ) return

            Vue.nextTick( function () {
                self.basemaps.forEach( function ( bm ) {
                    bm.update()
                } )
            } )
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                if ( self.showPanel !== false ) {
                    self.active = !self.active
                }
                else {
                    var i = self.basemaps.findIndex( function ( b ) {
                        return b.id == self.current
                    } )
                    setBasemap( self.basemaps[ ( i + 1 ) % self.basemaps.length ] )
                }
            },

            'set-base-map': function ( ev ) {
                setBasemap( ev )
            }
        } )

        function setBasemap( basemap ) {
            smk.$viewer.setBasemap( basemap.id )
        }

        smk.$viewer.changedBaseMap( function ( ev ) {
            self.current = ev.baseMap
            var bm = self.basemaps.find( function ( b ) {
                return b.id == self.current
            } )
            self.status = 'basemap-' + bm.id
            self.title = 'Base Map: ' + bm.title
        } )

        smk.$viewer.changedView( function ( ev ) {
            if ( !self.active ) return
            
            self.basemaps.forEach( function ( bm ) {
                bm.update()
            } )
        } )

        var v = smk.$viewer.getView()
        if ( v ) {
            self.center = v.center
            self.zoom = v.zoom
        }

        smk.$viewer.setBasemap( smk.viewer.baseMap )
    } )

    return BaseMapsTool

} )
