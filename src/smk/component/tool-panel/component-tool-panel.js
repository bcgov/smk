include.module( 'component-tool-panel', [ 
    'component', 
    'component-tool-panel.component-tool-panel-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'tool-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'component-tool-panel.component-tool-panel-html' ],
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
} )

