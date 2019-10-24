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
            },
            canScrollUp: {
                type: Boolean,
                default: false
            },
            canScrollDown: {
                type: Boolean,
                default: false  
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
            console.log('mounted')
            this.$nextTick( this.updateScroll )
        },
        updated: function () {
            console.log('updated')
            this.$nextTick( this.updateScroll )
        }
    } )

    var SidepanelEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedTool',
    ] )

    function Sidepanel( smk ) {
        var self = this

        SidepanelEvent.prototype.constructor.call( this )

        this.model = {
            currentTool: null,
            currentPanel: null,
            visible: false,
            panels: []
        }

        function getTool( id ) {
            return self.model.panels.find( function ( t ) { return t.id == id } )
        }

        this.toolStack = []
        this.usePanel = {}
        this.hasPrevious = {}


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
                    // if ( self.toolStack.length < 2 ) return
                    smk.emit( id, 'previous-panel' )
                    // self.popTool()
                },

                'hasPrevious': function ( id ) {                    
                    var t = getTool( id )
                    console.log('hasPrevious',t)
                    if ( t.hasPreviousCallback )
                        return t.hasPreviousCallback()

                    return !!t.parentId
                    // if ( this.model.panel )

                    // var len = self.toolStack.length
                    // if ( len < 2 ) return false
                    // if ( self.toolStack[ len - 2 ].container ) return false
                    // return true
                },

                'closePanel': function ( id ) {
                    // smk.emit( this.currentTool.id, 'close-panel' )
                    // self.closePanel()
                    this.panels.forEach( function ( t ) {
                        smk.$tool[ t.id ].active = false
                    } )
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
    }    

    Sidepanel.prototype.isPanelVisible = function () {
        return this.model.visible
    }

    Sidepanel.prototype.closePanel = function () {
        // this.model.visible = false
        // console.log('closePanel',this.toolStack)
        // this.toolStack.forEach( function ( t ) {
        //     t.active = false
        //     t.panel.expand = 0
        // } )

        // } )
    } 

    Sidepanel.prototype.setPanel = function ( tool ) {
        // console.log('setCurrentTool',tool)
        var titleProps
        if ( tool.widgetComponent )
            titleProps = { title: tool.title }
        else
            titleProps = tool.widget

        // this.model.currentTool = {
        //     id:             tool.id,
        //     subPanel:       tool.subPanel,
        //     panelComponent: tool.panelComponent,
        //     panel:          tool.panel,
        //     titleComponent: tool.titleComponent,
        //     titleProps:     titleProps
        // }

        // if ( this.usePanel[ tool.id ] ) {
            this.model.currentPanel = {
                id:             tool.id,
                subPanel:       tool.subPanel,
                panelComponent: tool.panelComponent,
                panel:          tool.panel,
                titleComponent: tool.titleComponent,
                titleProps:     titleProps
            }
        // }

        this.model.visible = true
        // this.changedTool( this.model.currentTool )
        this.changedTool( tool )
    }

    Sidepanel.prototype.setCurrentTool = function ( tool ) {
        console.log('setCurrentTool',tool)
        var titleProps
        if ( tool.widgetComponent )
            titleProps = { title: tool.title }
        else
            titleProps = tool.widget

        this.model.currentTool = {
            id:             tool.id,
            subPanel:       tool.subPanel,
            panelComponent: tool.panelComponent,
            panel:          tool.panel,
            titleComponent: tool.titleComponent,
            titleProps:     titleProps
        }

        if ( this.usePanel[ tool.id ] ) {
            this.model.currentPanel = {
                id:             tool.id,
                subPanel:       tool.subPanel,
                panelComponent: tool.panelComponent,
                panel:          tool.panel,
                titleComponent: tool.titleComponent,
                titleProps:     titleProps
            }
        }

        this.model.visible = true
        // this.changedTool( this.model.currentTool )
        this.changedTool( tool )
    }

    Sidepanel.prototype.isToolStacked = function ( tool ) {
        return this.toolStack.some( function ( t ) { return t.id == tool.id } )
    }

    Sidepanel.prototype.popTool = function ( tool ) {
        // console.log( 'pop',this.toolStack.length )
        if ( this.toolStack.length == 0 ) return 0

        var top = this.toolStack.length - 1

        if ( tool && this.toolStack[ top ].id != tool.id )
            return 

        var removed = this.toolStack.pop()
        removed.active = false

        if ( top > 0 ) {
            this.setCurrentTool( this.toolStack[ top - 1 ] )
            this.toolStack[ top - 1 ].active = true
        }
        else {
            this.closePanel()
        }

        return this.toolStack.length
    }

    Sidepanel.prototype.pushTool = function ( tool ) {
        // console.log( 'push', tool.id, this.toolStack.length )

        if ( this.isToolStacked( tool ) ) {
            tool = this.toolStack[ this.toolStack.length - 1 ]
            // console.log( 'already in stack, top is', tool.id )
        }
        else {
            if ( this.toolStack.length > 0 ) {
                var top = this.toolStack[ this.toolStack.length - 1 ]
                // console.log( 'pop?', top.id, top.subPanel, '>=', tool.id, tool.subPanel )
                while ( this.toolStack.length > 0 && top.subPanel >= tool.subPanel ) {
                    // console.log( 'popping', top.id )
                    this.toolStack.pop()
                    top.active = false
                    top = this.toolStack[ this.toolStack.length - 1 ]
                }
            }

            this.toolStack.push( tool )
        }

        if ( !this.isPanelVisible() ) {
            this.toolStack.forEach( function ( t ) {
                t.active = true
            } )
        }

        this.setCurrentTool( tool )
        // console.log( 'after push', this.toolStack.map( function ( t ) { return [ t.id, t.subPanel ] } ) )
    }

    Sidepanel.prototype.addTool = function ( tool, smk, hasPreviousCallback ) {
        var self = this

        this.model.panels.push( {
            id:             tool.id,
            parentId:       tool.parentId,
            type:           tool.type,
            panel:          tool.panel,
            panelComponent: tool.panelComponent,
            titleComponent: tool.titleComponent,
            titleProps:     tool.widgetComponent ? { title: tool.title } : tool.widget,
            hasPrevious:    tool.hasPrevious || !!tool.parentId            
        } )

        // this.hasPrevious[ tool.id ] = hasPreviousCallback
        // this.usePanel[ tool.id ] = usePanel !== false

        tool.changedActive( function () {
            self.model.visible = self.model.panels.some( function ( t ) { return t.panel.active } )

            // console.log( tool.id, tool.active, self.model.visible )
            // if ( tool.active ) {              
            //     self.pushTool( tool )
            // }
            // else {
            //     console.log( '!active', tool.id )
            //     if ( self.isToolStacked( tool ) ) {
            //         self.closePanel()
            //     }
            // }
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