include.module( 'tool.tool-internal-layers-js', [ 
    'tool.tool-base-js'
], function ( inc ) {
    "use strict";

    SMK.TYPE.ToolInternalLayers = function ( layerDefPropNames ) {       
        var self = this

        this.$initializers.push( function ( smk ) {
            var self = this

            this.layer = {}
            var groupItems = []

            layerDefPropNames.forEach( function ( prop ) {
                [].concat( self[ prop ] ).forEach( function ( ly ) {
                    ly.type = 'vector'
                    ly.isVisible = true
                    ly.isQueryable = false
                    ly.isInternal = true

                    var display = smk.$viewer.addLayer( ly )
                    display.class = "smk-inline-legend"            
        
                    groupItems.push( { id: display.id } )
        
                    self.layer[ ly.id ] = smk.$viewer.layerId[ ly.id ]    
                } )
            } )

            smk.$viewer.setDisplayContextItems( this.id, [ {
                id: 'tool-' + this.id,
                type: 'group',
                title: this.title,
                isVisible: false,
                isInternal: true,
                items: groupItems,
                showItem: false
            } ] )

            this.setInternalLayerVisible = function ( visible ) {
                smk.$viewer.displayContext[ self.id ].setItemVisible( 'tool-' + self.id, visible )
            }
        } )
    }
} )

