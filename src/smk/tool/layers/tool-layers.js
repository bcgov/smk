include.module( 'tool-layers', [ 
    'tool.tool-panel-js', 
    'tool-layers.panel-layers-html', 
    'tool-layers.layer-display-html', 
    'widgets' 
], function ( inc ) {
    "use strict";

    Vue.component( 'layer-display', {
        mixins: [ SMK.COMPONENT.ToolEmit ],
        template: inc[ 'tool-layers.layer-display-html' ],
        props: {
            id:      { type: String },
            display: { type: Object },
            glyph:   { type: Object },
            inGroup: { type: Boolean, default: false }
        },
    } )

    Vue.component( 'layers-widget', {
        extends: SMK.COMPONENT.ToolWidget,
    } )

    Vue.component( 'layers-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-layers.panel-layers-html' ],
        props: [ 'contexts', 'allVisible', 'glyph', 'command', 'filter', 'legend' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function LayersTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'layers-panel', 'layers-widget' )

        this.toolProp( 'contexts', { 
            forWidget: false,
            initial: []
        } )
        this.toolProp( 'allVisible', { 
            forWidget: false,
            initial: true
        } )
        this.toolProp( 'glyph', { 
            forWidget: false,
            initial: {}
        } )
        this.toolProp( 'command', { 
            forWidget: false,
            initial: {} 
        } )
        this.toolProp( 'filter', { 
            forWidget: false 
        } )
        this.toolProp( 'legend', { 
            forWidget: false,
            initial: false
        } )
    }

    SMK.TYPE.LayersTool = LayersTool

    Object.assign( LayersTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayersTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        if ( this.display )
            smk.$viewer.setDisplayContextItems( this.id, this.display )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return
                if ( !self.active ) return

                self.contexts = smk.$viewer.getDisplayContexts()

                smk.$viewer.setDisplayContextLegendsVisible( self.legend )
            },

            'change': function ( ev ) {
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
