include.module( 'tool.tool-panel-js', [ 'tool.tool-base-js', 'tool.tool-panel-html' ], function ( inc ) {
    "use strict";

    SMK.COMPONENT.ToolPanel = { 
        extends: SMK.COMPONENT.ToolBase,
        props: {
            showTitle:      Boolean,
            icon:           String,

            showPanel:      Boolean,
            showHeader:     Boolean,
            showSwipe:      Boolean,
            busy:           Boolean,
            message:        String,
            expand:         Number,
            hasPrevious:    Boolean,
        },
        computed: {
            classes: function () {
                var c = this.baseClasses
                return c
            }
        },
        methods: {}
    }

    var propProjection = SMK.UTIL.projection.apply( null, Object.keys( ( new ( Vue.extend( SMK.COMPONENT.ToolPanel ) )() )._props ) )

    SMK.COMPONENT.ToolPanel.methods.$$panelProps = function () { 
        return propProjection( this.$props )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'tool-panel', {
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool.tool-panel-html' ],
        data: function () {
            return {
                canScrollUp: false,
                canScrollDown: false
            }
        },
        methods: {
            startSwipe: function ( ev ) {
                // console.log('startSwipe',ev)
                this.xDown = ev.touches[0].clientX;                                      
                this.yDown = ev.touches[0].clientY;                             
            },
            moveSwipe: function ( ev ) {
                // console.log('moveSwipe',ev,this.xDown,this.yDown)
                if ( !this.xDown || !this.yDown )
                    return
            
                var xDiff = this.xDown - ev.touches[0].clientX
                var yDiff = this.yDown - ev.touches[0].clientY
            
                if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
                    if ( xDiff > 0 ) {
                        this.$emit( 'swipe-left' )
                    } 
                    else {
                        this.$emit( 'swipe-right' )
                    }                       
                } 
                else {
                    if ( yDiff > 0 ) {
                        this.$emit( 'swipe-up' )
                    } 
                    else { 
                        this.$emit( 'swipe-down' )
                    }                                                                 
                }

                this.xDown = null;
                this.yDown = null;                                                             
            },
            scrollBody: function ( ev ) {
                this.updateScroll()
            },            
            updateScroll: function () {
                var el = this.$refs.body
                this.canScrollUp = el.scrollTop > 0
                this.canScrollDown = ( el.scrollTop + el.clientHeight ) < el.scrollHeight
            }
        },
        mounted: function () {
            // console.log('mounted')
            this.$nextTick( this.updateScroll )
        },
        updated: function () {
            // console.log('updated')
            this.$nextTick( this.updateScroll )
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
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

