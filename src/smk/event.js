include.module( 'event', [ 'vue', 'util' ], function () {
    "use strict";

    function Event ( events ) {
        this.dispatcher = new Vue()
    }

    SMK.TYPE.Event = Event

    Event.prototype.catchExceptions = true

    Event.prototype.destroy = function () {
        this.dispatcher.$off()
    }

    Event.define = function ( names ) {
        var subclass = function() {
            Event.prototype.constructor.call( this )
        }

        $.extend( subclass.prototype, Event.prototype )

        names.forEach( function ( n ) {
            subclass.prototype[ n ] = function ( handler ) {
                if ( $.isFunction( handler ) ) {
                    this.dispatcher.$on( n, handler )
                    return this
                }

                var args = [].slice.call( arguments )
                args.unshift( n )

                try {
                    this.dispatcher.$emit.apply( this.dispatcher, args )
                }
                catch ( err ) {
                    if ( this.catchExceptions ) {
                        console.warn( 'Exception caught in ' + n + ' event handler:', err )
                    }
                    else {
                        err.message = 'Exception caught in ' + n + ' event handler: ' + err.message
                        throw err
                    }
                }

                return this
            }
        } )

        return subclass
    }

} )