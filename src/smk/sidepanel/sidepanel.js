include.module( 'sidepanel', [ 'vue', 'sidepanel.sidepanel-html', 'sidepanel.panel-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'side-panel', {
        template: inc[ 'sidepanel.panel-html' ],
    } )

    function Sidepanel( smk ) {
        var self = this

        this.model = {
            // activeToolId: null,
            tool: {},
            // hasPrevious: false,
            currentTool: null
        }

        this.toolStack = []
        //     {
        //         panelComponent: 'tool-list-panel',
        //         panel: {
        //             title: null,
        //             subWidgets: []
        //         }
        //     }            
        // ]

        // this.makePropWidget( 'icon', 'menu' )

        // this.makePropPanel( 'currentTool', this.toolStack[ 0 ] )
        // this.makePropPanel( 'previousTool', null )

        var el = smk.addToOverlay( inc[ 'sidepanel.sidepanel-html' ] )

        this.vm = new Vue( {
            el: el,
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

        this.container = $( smk.$container )
    }

    // Sidepanel.prototype.setActiveTool = function ( tool ) {
    //     if ( this.activeTool )
    //         this.activeTool.active = false

    //     this.activeTool = tool

    //     if ( this.activeTool ) {
    //         this.activeTool.active = true
            
    //         this.model.activeToolId = this.activeTool.id
    //         this.container.addClass( 'smk-panel-expanded' )
    //     }
    //     else {
    //         this.model.activeToolId = null
    //         this.container.removeClass( 'smk-panel-expanded' )
    //     }
    // }

    // Sidepanel.prototype.add = function ( tool ) {
    //     var self = this

    //     if ( tool.showPanel )
    //         this.vm.$set( this.model.tool, tool.id, {
    //             panelComponent: tool.panelComponent,
    //             titleComponent: tool.titleComponent,
    //             panel: tool.panel
    //         } )

    //     tool.changedActive( function () {
    //         if ( tool.active )
    //             self.setActiveTool( tool )
    //         else
    //             self.setActiveTool( null )
    //     } )
    // }

    Sidepanel.prototype.closePanel = function () {
        this.model.currentTool = null

        this.toolStack.forEach( function ( t ) {
            t.active = false
        } )
    } 

    Sidepanel.prototype.setCurrentTool = function ( tool ) {
        this.model.currentTool = {
            id: tool.id,
            panelComponent: tool.panelComponent,
            titleComponent: tool.titleComponent,
            panel: tool.panel,
            subPanel: tool.subPanel
        }
    }

    Sidepanel.prototype.popTool = function () {
        console.log( 'pop',this.toolStack.length )
        if ( this.toolStack.length == 0 ) return 0

        var top = this.toolStack.length - 1

        this.toolStack[ top ].active = false
        this.toolStack.pop()

        if ( top > 0 ) {
            this.setCurrentTool( this.toolStack[ top - 1 ] )
            // this.model.currentTool = this.toolStack[ top - 1 ]
            this.toolStack[ top - 1 ].active = true
        }
        else {
            this.model.currentTool = null
        }
        // this.previousTool = this.toolStack[ top - 2 ]

        return this.toolStack.length
    }

    Sidepanel.prototype.pushTool = function ( tool ) {
        console.log( 'push', tool.id, this.toolStack.length )

        if ( this.toolStack.some( function ( t ) { return t.id == tool.id } ) ) {
            tool = this.toolStack[ this.toolStack.length - 1 ]
            console.log( 'already in stack, top is', tool.id )
        }
        else {
        // if ( this.currentTool && this.currentTool.id == tool.id )
            // return

            if ( !tool.subPanel )
                if ( this.model.currentTool ) {
                    while ( this.model.currentTool.subPanel )
                        this.popTool()
                    this.popTool()
                }
                else {
                    while ( this.toolStack.length > 0 && this.toolStack[ this.toolStack.length - 1 ].subPanel )
                        this.toolStack.pop()
                    this.toolStack.pop()
                }
        // if ( tool.widgetComponent )
            // while ( this.popTool() > 1 ) {}

        // this.currentTool.active = false

            this.toolStack.push( tool )

        // this.previousTool = this.currentTool

        }

        if ( this.model.currentTool == null ) {
            this.toolStack.forEach( function ( t ) {
                t.active = true
            } )
        }

        // this.model.currentTool = tool
        this.setCurrentTool( tool )
        // this.currentTool.active = true
    }

    Sidepanel.prototype.addTool = function ( tool, smk ) {
        var self = this

        // if ( tool.useToolbar ) {
            // smk.$toolbar.add( tool )
        // }
        // else if ( tool.useList !== false ) {
            // tool.showTitle = true

            // this.toolStack[ 0 ].panel.subWidgets.push( {
            // this.subWidgets.push( {
            //     id: tool.id,
            //     type: tool.type,
            //     widgetComponent: tool.widgetComponent,
            //     widget: tool.widget
            // } )
        // }

        tool.changedActive( function () {
            // console.log( tool.id, tool.active, self.currentTool && self.currentTool.id )
            if ( tool.active ) {              
                // self.active = true

                self.pushTool( tool )
            }
            else {
                if ( self.model.currentTool != null && tool.id == self.model.currentTool.id ) {
                    self.closePanel()
                }
            }
        } )

        return true
    }


    SMK.TYPE.Sidepanel = Sidepanel

    return Sidepanel

} )