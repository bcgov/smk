include.module( 'tool.tool-js', [ 'event' ], function ( inc ) {
    "use strict";

    var ToolEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedEnabled',
        'changedActive',
        'changedGroup'
    ] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function Tool() {
        ToolEvent.prototype.constructor.call( this )

        this.$prop = {}
        this.$propFilter = {
            constructor: false
        }
        this.$componentProp = {}
        this.$initializers = []
    }
    SMK.TYPE.Tool = Tool
    Object.assign( Tool.prototype, ToolEvent.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Tool.prototype.configure = function ( option ) {
        Object.assign( this, option )
        return this
    }

    Tool.prototype.initialize = function ( smk ) {
        var self = this

        return this.$initializers.forEach( function ( init ) {
            init.call( self, smk )
        } )
    }

    Tool.prototype.defineProp = function ( name, opt ) {
        var self = this

        if ( name in this.$prop )
            throw new Error( 'prop "' + name + '" is already defined' )

        var prop = this.$prop[ name ] = Object.assign( {
            onSet: [],
            validate: function ( val, oldVal, name ) { return val }
        }, opt )

        prop.onSet = [].concat( prop.onSet )

        Object.defineProperty( this, name, {
            get: function () { 
                return prop.val
            },
            set: function ( val ) {
                var oldVal = prop.val
                var newVal = prop.validate( val, oldVal, name )
                if ( newVal === oldVal ) return

                prop.val = newVal
                prop.onSet.forEach( function ( f ) {
                    f.call( self, name, newVal )
                } )
            }
        } )
    }  

    Tool.prototype.getComponentProps = function ( componentName ) {
        var self = this

        if ( this.$componentProp[ componentName ] )
            return this.$componentProp[ componentName ]

        var component = Vue.component( componentName )
        if ( !component ) throw new Error( 'component "' + componentName + '" not defined' )

        var propNames = Object.keys( component.prototype ).filter( function ( c ) {
            if ( c in self.$propFilter ) return self.$propFilter[ c ]
            if ( c in self.$prop ) return true
            console.warn( 'prop "' + c + '" is defined in "' + componentName + '", but is not in tool', self )
            return false
        } )

        var prop = this.$componentProp[ componentName ] = {}
        propNames.forEach( function ( p ) {
            prop[ p ] = self[ p ]
            self.$prop[ p ].onSet.unshift( function ( name, val ) {
                console.debug( 'set',componentName,name,val )
                prop[ p ] = val
            } )
        } )

        return this.$componentProp[ componentName ]
    } 

    Tool.prototype.modifyComponentProp = function ( propName, modify ) {
        var self = this
        Object.keys( this.$componentProp ).forEach( function ( c ) {
            if ( !( propName in self.$componentProp[ c ] ) ) return

            modify.call( this, self.$componentProp[ c ][ propName ], c )
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    SMK.TYPE.Tool.define = function( name, construct, initialize, methods ) {
        var additionalInitializers = []

        SMK.TYPE[ name ] = function () {
            SMK.TYPE.Tool.prototype.constructor.call( this )

            SMK.TYPE.ToolBase.call( this )

            if ( construct ) construct.call( this )

            if ( initialize ) this.$initializers.push( initialize )
            this.$initializers = this.$initializers.concat( additionalInitializers )
           
            Object.assign( this, methods )
        }
    
        Object.assign( SMK.TYPE[ name ].prototype, SMK.TYPE.Tool.prototype )
    
        SMK.TYPE[ name ].addInitializer = function ( initialize ) {
            additionalInitializers = additionalInitializers.concat( initialize )
        }
    
        return SMK.TYPE[ name ]
    }
    
} )
