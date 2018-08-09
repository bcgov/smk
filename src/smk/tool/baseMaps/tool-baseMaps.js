include.module( 'tool-baseMaps', [ 'tool', 'widgets', 'viewer', 'leaflet', 'tool-baseMaps.panel-base-maps-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'baseMaps-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'baseMaps-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-baseMaps.panel-base-maps-html' ],
        props: [ 'center', 'zoom', 'current', 'basemaps', 'mapStyle' ]
    } )

    // leaflet specific
    Vue.directive( 'map', {
        unbind: function ( el, binding ) {
            // console.log( 'unbind', binding )
            binding.value.basemap.map.remove()
        },

        inserted: function ( el, binding ) {
            // console.log( 'inserted', binding )

            var map = L.map( el, {
                attributionControl: false,
                zoomControl: false,
                dragging: false,
                keyboard: false,
                scrollWheelZoom: false,
                zoom: 10
            } );

            binding.value.basemap.map = map

            map.addLayer( L.esri.basemapLayer( binding.value.basemap.id, { detectRetina: true } ) )

            if ( binding.value.center ) {
                map.setView( smkPointLatLng( binding.value.center ), binding.value.zoom )
            }

            map.invalidateSize()
        },

        update: function ( el, binding ) {
            // console.log( 'update', binding )

            var map = binding.value.basemap.map

            if ( binding.value.center ) {
                map.setView( smkPointLatLng( binding.value.center ), binding.value.zoom )
                map.invalidateSize();
            }
        }
    } )

    function smkPointLatLng( pt ) {
        return [ pt.latitude, pt.longitude ]
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function BaseMapsTool( option ) {
        this.makePropWidget( 'icon', 'map' )
        this.makePropPanel( 'center', null )
        this.makePropPanel( 'zoom', null )
        this.makePropPanel( 'current', null )
        this.makePropPanel( 'basemaps', [] )
        this.makePropPanel( 'mapStyle', {
            width: '110px',
            height: '110px',
        } )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:          3,
            position:       'menu',
            title:          'Base Maps',
            widgetComponent:'baseMaps-widget',
            panelComponent: 'baseMaps-panel',
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

        this.current = smk.viewer.baseMap

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            'set-base-map': function ( ev ) {
                smk.$viewer.setBasemap( ev.id )
            }
        } )

        smk.$viewer.changedBaseMap( function ( ev ) {
            self.current = ev.baseMap
        } )

        smk.$viewer.changedView( function ( ev ) {
            var view = smk.$viewer.getView()
            if ( !view ) return
            self.center = view.center
            self.zoom = view.zoom
        } )

        var v = smk.$viewer.getView()
        if ( v ) {
            self.center = v.center
            self.zoom = v.zoom
        }

    } )

    return BaseMapsTool

} )
