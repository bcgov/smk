include.module( 'tool.tool-panel-js', [ 
    'tool.tool-base-js'
    // 'component' 
], function ( inc ) {
    "use strict";

    SMK.TYPE.ToolPanel = function ( componentName ) {
        var self = this

        this.defineProp( 'showPanel' )
        this.defineProp( 'showHeader' )
        this.defineProp( 'showSwipe' )
        this.defineProp( 'busy' )
        this.defineProp( 'message' )
        this.defineProp( 'expand' )
        this.defineProp( 'hasPrevious' )

        this.showPanel = true
        this.showHeader = true
        this.showSwipe = false
        this.busy = false
        this.expand = 0
        this.hasPrevious = false

        this.$propFilter.classes = false

        this.makePanelComponent = function () {
            return {
                component: componentName,
                prop: self.getComponentProps( componentName )    
            }
        }        

        this.setMessage = function ( message, status, delay ) {
            var self = this
    
            if ( !message ) {
                this.status = null
                this.message = null
                return
            }
    
            this.status = status
            this.message = message
    
            if ( delay === null ) return
    
            if ( this.messageClear )
                this.messageClear.cancel()
    
            return SMK.UTIL.makePromise( function ( res, rej ) {
                self.messageClear = SMK.UTIL.makeDelayedCall( function () {
                    self.status = null
                    self.message = null        
                    res()
                }, { delay: delay || 2000 } )()
            } )
        }   
    }
} )

