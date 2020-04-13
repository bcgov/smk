include.module( 'tool.tool-base-js', [ 'tool.tool-js' ], function ( inc ) {
    "use strict";

    SMK.COMPONENT.ToolEmit = {
        methods: {
            $$emit: function ( event, arg ) {
                this.$root.trigger( this.id, event, arg, this )
            }
        }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.COMPONENT.ToolBase = {
        mixins: [ SMK.COMPONENT.ToolEmit ],
        props: { 
            id:         String,
            type:       String,
            title:      String,
            status:     String,
            active:     Boolean,
            enabled:    Boolean,
            visible:    Boolean,
            group:      Boolean,
        },
        computed: {
            baseClasses: function () {
                var c = {
                    'smk-tool-active': this.active,
                    'smk-tool-visible': this.visible,
                    'smk-tool-enabled': this.enabled,
                }
                c[ 'smk-tool-' + this.id ] = true
                if ( this.status )
                    c[ 'smk-tool-status-' + this.status ] = true

                return c
            }
        }
    } 
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.ToolBase = function () {       
        this.defineProp( 'id' )
        this.defineProp( 'type' )
        this.defineProp( 'title' )
        this.defineProp( 'status' )
        this.defineProp( 'visible', { onSet: function () { this.changedVisible() } } )
        this.defineProp( 'enabled', { onSet: function () { this.changedEnabled() } } )
        this.defineProp( 'active', { onSet: function () { this.changedActive() } } )
        this.defineProp( 'group', { onSet: function () { this.changedGroup() } } )
        this.defineProp( 'parentId' )

        this.visible = false
        this.enabled = true
        this.active = false
        this.group = false

        this.order = 1       

        this.$propFilter.baseClasses = false

        this.$initializers.push( function ( smk ) {
            var self = this

            function setParentId ( tool, parentId ) {
                tool.parentId = parentId
                tool.hasPrevious = !!parentId
                
                if ( !tool.parentId ) {
                    tool.rootId = tool.id
                }
        
                var group = {}
                Object.keys( smk.$tool ).forEach( function ( id ) {
                    var r = smk.$tool[ id ].rootId = findRoot( id )
                    if ( !group[ r ] ) 
                        group[ r ] = [] 
                    
                    group[ r ].push( id )
                } )
        
                smk.$group = group
    
                function findRoot( toolId ) {
                    var rootId = toolId
                    while ( smk.$tool[ rootId ] && smk.$tool[ rootId ].parentId ) {
                        rootId = smk.$tool[ rootId ].parentId
                    }
                    return rootId
                }
            }   
        
            setParentId( this, this.parentId )
    
            var positions = [].concat( this.position || [] )
    
            if ( positions.length ) {
                positions.push( 'toolbar' )
    
                var found = positions.some( function ( p ) { 
                    if ( !( p in smk.$tool ) ) {
                        console.warn( 'position ' + p + ' not available for tool ' + self.id )
                        return false
                    }
    
                    if ( p == self.id )
                        return false 
    
                    return smk.$tool[ p ].addTool( self, smk, setParentId )
                } )
    
                if ( !found ) {
                    console.warn( 'no position found for tool ' + self.id )
                }
            }
    
            this.changedActive( function () {
                var ids = smk.getToolGroup( self.rootId )
                var g = ids.some( function ( id ) {
                    return smk.$tool[ id ].active
                } )
                ids.forEach( function ( id ) {
                    smk.$tool[ id ].group = g
                } )
    
                if ( self.active ) {
                    ids.forEach( function ( id ) {
                        smk.$tool[ id ].active = self.isToolInGroupActive( id )
                    } )
                }
                else {
                }
            } )
    
            if ( this.id == this.rootId )
                this.changedGroup( function () {
                    if ( self.group ) {
                        smk.getToolRootIds().forEach( function ( rootId ) {
                            if ( rootId == self.id ) return
    
                            smk.getToolGroup( rootId ).forEach( function ( id ) {
                                smk.$tool[ id ].active = false
                            } )
                        } )
                    }
                    else {
                    }
                } )
   
        } )
    
        this.isToolInGroupActive = function ( toolId ) {
            return toolId == this.id
        }

        this.addTool = function ( tool, smk ) {
            return false
        }       
    }
} )
