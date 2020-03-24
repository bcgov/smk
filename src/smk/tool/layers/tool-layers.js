include.module( 'tool-layers', [ 'tool', 'widgets', 'tool-layers.panel-layers-html', 'tool-layers.layer-display-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'layers-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'layer-display', {
        template: inc[ 'tool-layers.layer-display-html' ],
        props: {
            id:      { type: String },
            display: { type: Object },
            glyph:   { type: Object },
            inGroup: { type: Boolean, default: false }
        },
        mixins: [ inc.widgets.emit ],
    } )

    Vue.component( 'layers-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-layers.panel-layers-html' ],
        props: [ 'contexts', 'allVisible', 'glyph', 'command', 'filter', 'legend' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LayersTool( option ) {
        this.makePropWidget( 'icon' ) //, 'layers' )

        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'contexts', [] )
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

        smk.$viewer.setDisplayContextItems( this.id, this.display )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                self.active = !self.active
                if ( !self.active ) return

                self.contexts = smk.$viewer.getDisplayContexts()

                smk.$viewer.setDisplayContextLegendsVisible( self.legend )
            },

            'change': function ( ev ) {
                // console.log(ev)
                Object.assign( self, ev )

                smk.$viewer.setDisplayContextLegendsVisible( self.legend )

                var re 
                if ( !self.filter || !self.filter.trim() ) 
                    re = /.*/;
                else {
                    var f = self.filter.trim()
                    re = new RegExp( f.toLowerCase().split( /\s+/ ).map( function ( part ) { return '(?=.*' + part + ')' } ).join( '' ), 'i' )
                }
                smk.$viewer.displayContext.layers.setFilter( re )
            },

            'set-all-layers-visible': function ( ev ) {
                smk.$viewer.displayContext.layers.setItemVisible( smk.$viewer.displayContext.layers.root.id, ev.visible, ev.deep )
                smk.$viewer.updateLayersVisible()
            },

            'set-item-visible': function ( ev ) {
                smk.$viewer.displayContext.layers.setItemVisible( ev.id, ev.visible, ev.deep )
                smk.$viewer.updateLayersVisible()
            },

            'layer-click': function ( ev ) {
                if ( ev.metadataUrl )
                    window.open( ev.metadataUrl, '_blank' )
            },

            'folder-click': function ( ev ) {
                smk.$viewer.setDisplayContextFolderExpanded( ev.id, !ev.isExpanded )
            },

            'group-click': function ( ev ) {
                // console.log( 'group item-click', ev )
            },

            'swipe-up': function ( ev ) {                
                smk.$sidepanel.setExpand( 2 )
            },

            'swipe-down': function ( ev ) {
                smk.$sidepanel.incrExpand( -1 )
            }
        } )


        smk.$viewer.changedLayerVisibility( function () {
            self.allVisible = smk.$viewer.displayContext.layers.isItemVisible( smk.$viewer.displayContext.layers.root.id )
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
