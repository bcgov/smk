include.module( 'sidepanel', [ 'vue', 'tool', 'sidepanel.sidepanel-html', 'sidepanel.panel-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'side-panel', {
        template: inc[ 'sidepanel.panel-html' ],
        props: {
            showHeader: {
                type: Boolean,
                default: true
            },
            showSwipe: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: ''
            },
            busy: {
                type: Boolean,
                default: false
            }
        },
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
    var SidepanelEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedTool',
    ] )

    function Sidepanel( smk ) {
        var self = this

        SidepanelEvent.prototype.constructor.call( this )

        this.model = {
            visible: false,
            expand: 0,
            panels: []
        }

        function getTool( id ) {
            return self.model.panels.find( function ( t ) { return t.id == id } )
        }

        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'sidepanel.sidepanel-html' ] ),
            data: this.model,
            methods: {
                'trigger': function ( toolId, event, arg ) {
                    smk.emit( toolId, event, arg )
                },

                'previousPanel': function ( id ) {     
                    var t = getTool( id )
                    if ( t ) {
                        var pt = getTool( t.parentId )
                        if ( pt ) {
                            smk.$tool[ t.id ].active = false
                            smk.$tool[ pt.id ].active = true
                        }
                    }

                    smk.emit( id, 'previous-panel' )
                },

                'closePanel': function ( id ) {
                    self.closePanel()
                },

                'beforeShow': function () {
                    // console.log( 'beforeShow' )
                },

                'afterShow': function () {
                    // console.log( 'afterShow' )
                    self.changedVisible()
                },

                'beforeHide': function () {
                    // console.log( 'beforeHide' )
                    self.changedVisible()
                },

                'afterHide': function () {
                    // console.log( 'afterHide' )
                }

            },
        } )

        this.closePanel = function () {
            self.model.panels.forEach( function ( t ) {
                smk.$tool[ t.id ].active = false
            } )
        }

        this.changedVisible( function () {
            if ( self.isPanelVisible() ) {
                self.model.expand = 1
            }
            else {
                self.model.expand = 0
            }
        } )
    }    

    Sidepanel.prototype.getExpand = function () {
        return this.model.expand
    }

    Sidepanel.prototype.setExpand = function ( val ) {
        if ( val ) {
            this.model.expand = val
            return this.model.expand
        }
        else {
            this.closePanel()
        }
    }

    Sidepanel.prototype.incrExpand = function ( incr ) {
        return this.setExpand( Math.max( 0, this.getExpand() + ( incr || 1 ) ) )
    }

    Sidepanel.prototype.isPanelVisible = function () {
        return this.model.visible
    }
    
    Sidepanel.prototype.addTool = function ( tool, smk ) {
        var self = this

        this.model.panels.push( {
            id:             tool.id,
            parentId:       tool.parentId,
            type:           tool.type,
            panel:          tool.panel,
            panelComponent: tool.panelComponent,
            titleComponent: tool.titleComponent,
            titleProps:     tool.widgetComponent ? { title: tool.title } : tool.widget,
        } )

        tool.changedActive( function () {
            self.model.visible = self.model.panels.some( function ( t ) { return t.panel.active } )
        } )

        return true
    }

    $.extend( Sidepanel.prototype, SidepanelEvent.prototype )

    SMK.TYPE.Sidepanel = Sidepanel
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function PanelTool( option ) {
        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'status', null )
        this.makePropPanel( 'message', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
        }, option ) )
    }

    SMK.TYPE.PanelTool = PanelTool

    $.extend( PanelTool.prototype, SMK.TYPE.Tool.prototype )
    PanelTool.prototype.afterInitialize = []

    PanelTool.prototype.setMessage = function ( message, status, delay ) {
        if ( !message ) {
            this.status = null
            this.message = null
            return
        }

        this.status = status
        this.message = message

        if ( delay )
            return SMK.UTIL.makePromise( function ( res ) { setTimeout( res, delay ) } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return Sidepanel

} ) 