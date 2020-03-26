include.module( 'tool', [ 'jquery', 'event' ], function () {
    "use strict";

    var ToolEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedEnabled',
        'changedActive',
        'changedGroup'
    ] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function Tool( option ) {
        ToolEvent.prototype.constructor.call( this )

        this.makeProp( 'id', null )
        this.makeProp( 'title', null )
        this.makeProp( 'visible', false, 'changedVisible' )
        this.makeProp( 'enabled', true, 'changedEnabled' )
        this.makeProp( 'active', false, 'changedActive' )
        this.makeProp( 'group', false, 'changedGroup' )

        this.makePropPanel( 'expand', 0 )
        this.makePropPanel( 'hasPrevious', false )

        this.makePropWidget( 'type', 'unknown' )
        this.makePropWidget( 'showTitle', false )
        this.makePropWidget( 'showWidget', null )
        
        $.extend( this, option )
    }

    Tool.prototype.order = 1
    // Tool.prototype.position = 'toolbar'
    Tool.prototype.showPanel = true
    // Tool.prototype.subPanel = 0
    Tool.prototype.parentId = null

    SMK.TYPE.Tool = Tool

    $.extend( Tool.prototype, ToolEvent.prototype )
    Tool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.makeProp = function ( name, initial, event ) {
        var self = this

        if ( !this.widget ) this.widget = {}
        if ( !this.panel ) this.panel = {}

        self.widget[ name ] = initial
        self.panel[ name ] = initial
        Object.defineProperty( self, name, {
            get: function () { 
                return self.widget[ name ] 
            },
            set: function ( v ) {
                // if ( name == 'active')
                    // console.warn('SET', self.widget.id,name,self.widget[ name ],self.panel[ name ],v )
                if ( v == self.widget[ name ] && v == self.panel[ name ] ) return
                self.widget[ name ] = v
                self.panel[ name ] = v
                if ( event ) self[ event ].call( self )
                return self
            }
        } )
    }

    Tool.prototype.makePropWidget = function ( name, initial, event ) {
        var self = this

        if ( !this.widget ) this.widget = {}

        self.widget[ name ] = initial
        Object.defineProperty( self, name, {
            get: function () { return self.widget[ name ] },
            set: function ( v ) {
                if ( v == self.widget[ name ] ) return
                self.widget[ name ] = v
                if ( event ) self[ event ].call( self )
                return self
            }
        } )
    }

    Tool.prototype.makePropPanel = function ( name, initial, event ) {
        var self = this

        if ( !this.panel ) this.panel = {}

        self.panel[ name ] = initial
        Object.defineProperty( self, name, {
            get: function () { return self.panel[ name ] },
            set: function ( v ) {
                if ( v == self.panel[ name ] ) return
                self.panel[ name ] = v
                if ( event ) self[ event ].call( self )
                return self
            }
        } )
    }

    Tool.prototype.addTool = function ( tool, smk ) {
        return false
    }

    Tool.prototype.setParentId = function ( toolId, smk ) {
        var self = this

        this.parentId = toolId
        this.hasPrevious = !!toolId
        
        if ( !this.parentId ) {
            this.rootId = this.id
        }

        var group = {}
        Object.keys( smk.$tool ).forEach( function ( id ) {
            var r = smk.$tool[ id ].rootId = findRoot( id, smk )
            if ( !group[ r ] ) 
                group[ r ] = [] 
            
            group[ r ].push( id )
        } )

        smk.$group = group
    }

    function findRoot( toolId, smk ) {
        var rootId = toolId
        while ( smk.$tool[ rootId ] && smk.$tool[ rootId ].parentId ) {
            rootId = smk.$tool[ rootId ].parentId
        }
        return rootId
    }

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.initialize = function ( smk ) {
        var self = this

        this.setParentId( this.parentId, smk )

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

                return smk.$tool[ p ].addTool( self, smk )
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
        } )

        return this.afterInitialize.forEach( function ( init ) {
            init.call( self, smk )
        } )
    }

    return Tool

} )
