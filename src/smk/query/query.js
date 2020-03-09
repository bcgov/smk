include.module( 'query.query-js', [ 'jquery', 'util', 'event' ], function () {
    "use strict";

    var QueryEvent = SMK.TYPE.Event.define( [
        // 'startedLoading',
        // 'finishedLoading',
    ] )

    function Query( layerId, config ) {
        var self = this

        QueryEvent.prototype.constructor.call( this )

        Object.assign( this, config )
        this.layerId = layerId
        this.id = this.layerId + '--' + this.id
    }

    $.extend( Query.prototype, QueryEvent.prototype )

    Query.prototype.maxUniqueValues = 100

    SMK.TYPE.Query = Query
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Query.prototype.getParameters = function ( viewer ) {
        var self = this;

        return this.parameters.map( function ( p ) {
            return new QueryParameter[ p.type ]( self, p, viewer )
        } )
    }

    Query.prototype.queryLayer = function ( arg ) {
        console.log( 'not implemented', arg )
    }

    Query.prototype.fetchUniqueValues = function ( attribute, viewer ) {
        console.log( 'not implemented', attribute )
    }

    Query.prototype.canUseWithExtent = function ( viewer ) {
        return true
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function QueryParameter( query, config ) {
        this.id = query.id + '--' + config.id
        this.layerId = query.layerId
        this.component = 'parameter-' + config.type
        this.prop = $.extend( true, {
            value: null,
            focus: 0
        }, config )
        this.initial = config.value
    }

    QueryParameter.prototype.mounted = function () {}
    QueryParameter.prototype.focus = function () {}
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryParameter[ 'constant' ] = function () {
        QueryParameter.prototype.constructor.apply( this, arguments )
    }

    Object.assign( QueryParameter[ 'constant' ].prototype, QueryParameter.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryParameter[ 'input' ] = function () {
        QueryParameter.prototype.constructor.apply( this, arguments )
    }

    Object.assign( QueryParameter[ 'input' ].prototype, QueryParameter.prototype )

    QueryParameter[ 'input' ].prototype.focus = function () {
        this.prop.focus += 1
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryParameter[ 'select' ] = function () {
        QueryParameter.prototype.constructor.apply( this, arguments )
    }

    Object.assign( QueryParameter[ 'select' ].prototype, QueryParameter.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    QueryParameter[ 'select-unique' ] = function ( query, config, viewer ) {
        var self = this

        config.type = 'select'

        var uniqueAttribute = config.uniqueAttribute
        delete config.uniqueAttribute

        QueryParameter.prototype.constructor.call( this, query, config )

        this.mounted = function () {
            if ( self.fetchUnique ) return
            self.fetchUnique = query.fetchUniqueValues( uniqueAttribute, viewer )
                .then( function ( values ) {
                    Vue.set( self.prop, 'choices', values
                        .map( function ( v ) { return { value: v } } )
                        .sort( function ( a, b ) { return a.value > b.value ? 1 : -1 } )
                    )
                } )
                .catch( function ( e ) {
                    console.warn( e )
                    self.prop.useFallback = true
                } )
        }
    }

    Object.assign( QueryParameter[ 'select-unique' ].prototype, QueryParameter.prototype )
} )
