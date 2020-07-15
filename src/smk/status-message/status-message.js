include.module( 'status-message', [ 'vue', 'status-message.status-message-html' ], function ( inc ) {
    "use strict";

    var StatusMessageEvent = SMK.TYPE.Event.define( [
    ] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function StatusMessage( smk ) {
        StatusMessageEvent.prototype.constructor.call( this )

        this.model = {
            status:     null,
            message:    null,
            busy:       false
        }

        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'status-message.status-message-html' ] ),
            data: this.model,
        } )

        this._promise = SMK.UTIL.resolved()
    }    

    StatusMessage.prototype.clear = function () {
        if ( this._whenCleared )
            this._whenCleared()
    }

    StatusMessage.prototype.cancel = function ( arg ) {
        if ( this._whenCancelled )
            this._whenCancelled( arg )
    }

    StatusMessage.prototype.show = function ( message, status, delay, busy ) {
        var self = this

        if ( !message ) 
            return this.clear()

        this.cancel( 'replaced' )

        return this._promise.finally( function () {
            self.model.status = status
            self.model.message = message
            self.model.busy = busy
            // console.log( message, status, busy )

            var clear
            self._promise = SMK.UTIL.makePromise( function ( res, rej ) {
                clear = self._whenCleared = res
                self._whenCancelled = rej
            } )
            .catch( function ( err ) {
                // console.warn( err )
            } )
    
            if ( delay !== null )
                SMK.UTIL.makeDelayedCall( function () { clear() }, { delay: delay || 2000 } )()
    
            return self._promise.finally( function () {
                self.model.status = null
                self.model.message = null
                self.model.bust = null
                self._whenCleared = null
                self._whenCancelled = null
                // console.log('finally')
            } )    
        } )
    }   

    $.extend( StatusMessage.prototype, StatusMessageEvent.prototype )

    SMK.TYPE.StatusMessage = StatusMessage

    return StatusMessage
} ) 