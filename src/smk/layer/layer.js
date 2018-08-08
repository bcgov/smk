include.module( 'layer.layer-js', [ 'jquery', 'util', 'event' ], function () {
    "use strict";

    var LayerEvent = SMK.TYPE.Event.define( [
        'startedLoading',
        'finishedLoading',
    ] )

    function Layer( config ) {
        var self = this

        LayerEvent.prototype.constructor.call( this )

        $.extend( this, {
            config: config,
            // visible: false,
        } )

        var loading = false
        Object.defineProperty( this, 'loading', {
            get: function () { return loading },
            set: function ( v ) {
                if ( !!v == loading ) return
                // console.log( self.config.id, v )
                loading = !!v
                if ( v )
                    self.startedLoading()
                else
                    self.finishedLoading()
            }
        } )

        Object.defineProperty( this, 'id', {
            get: function () { return config.id }
        } )
    }

    $.extend( Layer.prototype, LayerEvent.prototype )

    SMK.TYPE.Layer = Layer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Layer.prototype.initialize = function ( id ) {
        var self = this

        // this.id = id
        // this.parentId = parentId
        // this.index = index

        if ( this.config.attributes ) {
            this.attribute = {}

            this.config.attributes.forEach( function ( at ) {
                if ( at.name in self.attribute )
                    console.warn( 'attribute ' + at.name + ' is duplicated in ' + self.id )

                self.attribute[ at.name ] = at

                if ( self.config.geometryAttribute && self.config.geometryAttribute == at.name )
                    at.isGeometry = true

                if ( self.config.titleAttribute && self.config.titleAttribute == at.name )
                    at.isTitle = true
            } )
        }
    }

    Layer.prototype.hasChildren = function () { return false }

    Layer.prototype.getLegends = function () {
        return SMK.UTIL.resolved()
    }

    Layer.prototype.getFeaturesAtPoint = function ( arg ) {
    }

    Layer.prototype.canMergeWith = function ( other ) {
        return false
    }

    // I know this looks backwards. But it makes sense if you think of the scale values as denominators.
    Layer.prototype.inScaleRange = function ( view ) {
        // console.log( this.config.title, this.config.minScale, view.scale, this.config.maxScale )
        if ( this.config.maxScale && view.scale < this.config.maxScale ) return false
        if ( this.config.minScale && view.scale > this.config.minScale ) return false
        return true
    }

} )
