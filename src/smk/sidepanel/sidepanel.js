include.module( 'sidepanel', [ 'vue', 'sidepanel.sidepanel-html', 'sidepanel.panel-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'side-panel', {
        template: inc[ 'sidepanel.panel-html' ],
        props: {
            showHeader: {
                type: Boolean,
                default: true
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
        }
    } )

    function Sidepanel( smk ) {
        var self = this

        this.model = {
            currentTool: null
        }

        this.toolStack = []

        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'sidepanel.sidepanel-html' ] ),
            data: this.model,
            methods: {
                'trigger': function ( toolId, event, arg ) {
                    smk.emit( toolId, event, arg )
                },

                'previousPanel': function () {
                    if ( self.toolStack.length > 1 )
                        self.popTool()
                },

                'closePanel': function () {
                    self.closePanel()
                },

                'depth': function () {
                    return self.toolStack.length
                }
            },
        } )
    }

    Sidepanel.prototype.closePanel = function () {
        this.model.currentTool = null

        this.toolStack.forEach( function ( t ) {
            t.active = false
        } )
    } 

    Sidepanel.prototype.setCurrentTool = function ( tool ) {
        var titleProps
        if ( tool.widgetComponent )
            titleProps = { title: tool.title }
        else
            titleProps = tool.widget

        this.model.currentTool = {
            id:             tool.id,
            class:          tool.class,
            subPanel:       tool.subPanel,
            panelComponent: tool.panelComponent,
            panel:          tool.panel,
            titleComponent: tool.titleComponent,
            titleProps:     titleProps
        }


    }

    Sidepanel.prototype.isToolStacked = function ( tool ) {
        return this.toolStack.some( function ( t ) { return t.id == tool.id } )
    }

    Sidepanel.prototype.popTool = function () {
        console.log( 'pop',this.toolStack.length )
        if ( this.toolStack.length == 0 ) return 0

        var top = this.toolStack.length - 1

        this.toolStack[ top ].active = false
        this.toolStack.pop()

        if ( top > 0 ) {
            this.setCurrentTool( this.toolStack[ top - 1 ] )
            this.toolStack[ top - 1 ].active = true
        }
        else {
            this.model.currentTool = null
        }

        return this.toolStack.length
    }

    Sidepanel.prototype.pushTool = function ( tool ) {
        console.log( 'push', tool.id, this.toolStack.length )

        if ( this.isToolStacked( tool ) ) {
            tool = this.toolStack[ this.toolStack.length - 1 ]
            // console.log( 'already in stack, top is', tool.id )
        }
        else {
            if ( this.model.currentTool ) {
                // console.log( 'current', this.model.currentTool.id, this.model.currentTool.subPanel, tool.subPanel )
                while ( this.model.currentTool && this.model.currentTool.subPanel >= tool.subPanel ) {
                    // console.log( this.model.currentTool.subPanel, tool.subPanel )
                    this.popTool()
                }
            }
            else if ( this.toolStack.length > 0 ) {
                // console.log( 'no current', this.toolStack[ this.toolStack.length - 1 ].subPanel, tool.subPanel )
                while ( this.toolStack.length > 0 && this.toolStack[ this.toolStack.length - 1 ].subPanel >= tool.subPanel ) {
                    // console.log( this.toolStack[ this.toolStack.length - 1 ].subPanel, tool.subPanel )
                    this.toolStack.pop()
                }
            }

            this.toolStack.push( tool )
        }

        if ( this.model.currentTool == null ) {
            this.toolStack.forEach( function ( t ) {
                t.active = true
            } )
        }

        this.setCurrentTool( tool )
    }

    Sidepanel.prototype.addTool = function ( tool, smk ) {
        var self = this

        tool.changedActive( function () {
            // console.log( tool.id, tool.active, self.currentTool && self.currentTool.id )
            if ( tool.active ) {              
                self.pushTool( tool )
            }
            else {
                if ( self.isToolStacked( tool ) ) {
                    self.closePanel()
                }
            }
        } )

        return true
    }

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