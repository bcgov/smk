include.module( 'tool-layers', [ 'tool', 'widgets', 'tool-layers.panel-layers-html', 'tool-layers.layer-display-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'layers-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'layer-display', {
        template: inc[ 'tool-layers.layer-display-html' ],
        props: [ 'id', 'items' ],
        mixins: [ inc.widgets.emit ],
    } )

    Vue.component( 'layers-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-layers.panel-layers-html' ],
        props: [ 'busy', 'items', 'config', 'allVisible' ],
        data: function () {
            return Object.assign( {}, this.config )
        },
        watch: {
            config: function ( val ) {
                Object.keys( val ).forEach( function ( k ) {
                    this[ k ] = val[ k ]
                } )
            }
        },
        methods: {
            getConfigState: function () {
                var self = this

                var state = {}
                Object.keys( this.config ).forEach( function ( k ) {
                    state[ k ] = self[ k ]
                } )
                return state
            },
        }
    } )

    function isLayerVisible( ly ) { return ly.visible }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LayersTool( option ) {
        this.makePropWidget( 'icon', 'layers' )
        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'items', [] )
        this.makePropPanel( 'allVisible', true )
        this.makePropPanel( 'config', {
            legend: false,
            filter: null
        } )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:          3,
            position:       'menu',
            title:          'Layers',
            widgetComponent:'layers-widget',
            panelComponent: 'layers-panel',
        }, option ) )
    }

    SMK.TYPE.LayersTool = LayersTool

    $.extend( LayersTool.prototype, SMK.TYPE.Tool.prototype )
    LayersTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayersTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            },

            'config': function ( ev ) {
                // console.log( ev )
                Object.assign( self.config, ev )

                smk.$viewer.layerDisplayContext.setLegendsVisible( ev.legend, smk.$viewer.layerId, smk.$viewer )

                var re 
                if ( !ev.filter || !ev.filter.trim() ) 
                    re = /.*/;
                else {
                    var f = ev.filter.trim()
                    re = new RegExp( f.toLowerCase().split( /\s+/ ).map( function ( part ) { return '(?=.*' + part + ')' } ).join( '' ), 'i' )
                }
                smk.$viewer.layerDisplayContext.setFilter( re )
            },

            'set-all-layers-visible': function ( ev ) {
                smk.$viewer.layerDisplayContext.setItemVisible( smk.$viewer.layerDisplayContext.root.id, ev.visible, ev.deep )
                smk.$viewer.updateLayersVisible()
            },

            'set-folder-expanded': function ( ev ) {
                smk.$viewer.layerDisplayContext.setFolderExpanded( ev.id, ev.expanded )
            },

            'set-item-visible': function ( ev ) {
                smk.$viewer.layerDisplayContext.setItemVisible( ev.id, ev.visible, ev.deep )
                smk.$viewer.updateLayersVisible()
            },
        } )


        smk.$viewer.changedLayerVisibility( function () {
            self.allVisible = smk.$viewer.layerDisplayContext.isItemVisible( smk.$viewer.layerDisplayContext.root.id )
        } )

        smk.$viewer.startedLoading( function ( ev ) {
            self.busy = true
        } )

        smk.$viewer.finishedLoading( function ( ev ) {
            self.busy = false
        } )


        if ( this.display )
            smk.$viewer.setLayerDisplay( this.display )

        this.items = smk.$viewer.layerDisplayContext.root.items

        return smk.$viewer.updateLayersVisible()
    } )

    return LayersTool
} )
