include.module( 'tool-layers', [ 'tool', 'widgets', 'tool-layers.panel-layers-html', 'tool-layers.layer-display-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'layers-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'layer-display', {
        template: inc[ 'tool-layers.layer-display-html' ],
        props: [ 'id', 'items', 'glyph' ],
        mixins: [ inc.widgets.emit ],
    } )

    Vue.component( 'layers-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-layers.panel-layers-html' ],
        props: [ 'items', 'allVisible', 'glyph', 'command', 'filter', 'legend' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LayersTool( option ) {
        this.makePropWidget( 'icon' ) //, 'layers' )

        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'items', [] )
        this.makePropPanel( 'allVisible', true )
        this.makePropPanel( 'glyph', {} )
        this.makePropPanel( 'command', {} )
        this.makePropPanel( 'filter', null )
        this.makePropPanel( 'legend', false )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            // order:          3,
            // position:       'menu',
            // title:          'Layers',
            widgetComponent:'layers-widget',
            panelComponent: 'layers-panel',
            display:        null
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
                if ( !self.enabled ) return

                self.active = !self.active
                if ( !self.active ) return

                self.items = smk.$viewer.getLayerDisplayItems()
            },

            'change': function ( ev ) {
                // console.log(ev)
                Object.assign( self, ev )

                smk.$viewer.layerDisplayContext.setLegendsVisible( self.legend, smk.$viewer.layerId, smk.$viewer )

                var re 
                if ( !self.filter || !self.filter.trim() ) 
                    re = /.*/;
                else {
                    var f = self.filter.trim()
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

            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
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
    } )

    return LayersTool
} )
