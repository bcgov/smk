include.module( 'tool.tool-js', [ 'event' ], function ( inc ) {
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
    var ToolEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedEnabled',
        'changedActive',
        'changedGroup'
    ] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.COMPONENT.Tool = {
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
    function Tool() {
        ToolEvent.prototype.constructor.call( this )

        this.prop = {}

        this.toolProp( 'id', {
        } )
        this.toolProp( 'type', {
        } )
        this.toolProp( 'title', {
        } )
        this.toolProp( 'status', {
        } )
        this.toolProp( 'visible', { 
            initial: false, 
            onSet: function () { this.changedVisible() } 
        } )
        this.toolProp( 'enabled', { 
            initial: true, 
            onSet: function () { this.changedEnabled() } 
        } )
        this.toolProp( 'active', { 
            initial: false, 
            onSet: function () { this.changedActive() } 
        } )
        this.toolProp( 'group', { 
            initial: false, 
            onSet: function () { this.changedGroup() } 
        } )
        this.toolProp( 'parentId', { 
        } )
    }

    Tool.prototype.configure = function ( option ) {
        Object.assign( this, option )
        return this
    }

    Tool.prototype.order = 1

    SMK.TYPE.Tool = Tool

    Object.assign( Tool.prototype, ToolEvent.prototype )
    Tool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.toolProp = function ( name, opt ) {
        var self = this

        opt = Object.assign( {
            initial: null,
            onSet: function () {},
            validate: function ( val, oldVal, name ) { return val }
        }, opt )

        Object.defineProperty( self, name, {
            get: function () { 
                return self.prop[ name ] 
            },
            set: function ( val ) {
                var oldVal = self.prop[ name ]
                var newVal = opt.validate( val, oldVal, name )
                if ( newVal == self.prop[ name ] ) return

                self._setProp( name, newVal, opt )
                opt.onSet.call( self, name )
            }
        } )

        this[ name ] = opt.initial
    }

    Tool.prototype._setProp = function ( name, val ) {
        this.prop[ name ] = val
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.addTool = function ( tool, smk ) {
        return false
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.initialize = function ( smk ) {
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

        return this.afterInitialize.forEach( function ( init ) {
            init.call( self, smk )
        } )
    }

    Tool.prototype.isToolInGroupActive = function ( toolId ) {
        return toolId == this.id
    }
} )
