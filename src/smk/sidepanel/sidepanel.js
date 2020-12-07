include.module( 'sidepanel', [ 'vue', 'tool', 'sidepanel.sidepanel-html' ], function ( inc ) {
    "use strict";

    var SidepanelEvent = SMK.TYPE.Event.define( [
        'changedVisible',
        'changedTool',
        'changedSize',
    ] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function Sidepanel( smk ) {
        var self = this

        SidepanelEvent.prototype.constructor.call( this )

        this.model = {
            visible: false,
            expand: 0,
            panels: []
        }

        function getTool( id ) {
            return self.model.panels.find( function ( p ) { return p.prop.id == id } )
        }

        this.vm = new Vue( {
            el: smk.addToOverlay( inc[ 'sidepanel.sidepanel-html' ] ),
            data: this.model,
            methods: {
                'trigger': function ( toolId, event, arg, comp ) {
                    smk.emit( toolId, event, arg, comp )
                },

                'previousPanel': function ( id ) {
                    var t = getTool( id )
                    if ( t ) {
                        var pt = getTool( t.prop.parentId )
                        if ( pt ) {
                            smk.getToolById( pt.prop.id ).active = true
                            smk.getToolById( t.prop.id ).active = false
                        }
                    }

                    smk.emit( id, 'previous-panel' )
                },

                'closePanel': function ( id ) {
                    self.setExpand( 0 )
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
                },

                'afterHide': function () {
                    // console.log( 'afterHide' )
                    self.changedVisible()
                }

            },
        } )

        this.changedVisible( function () {
            if ( self.isPanelVisible() ) {
                self.setExpand( 1 )
            }
            else {
                self.changedSize()

                self.model.panels.forEach( function ( p ) {
                    smk.getToolById( p.prop.id ).active = false
                } )
            }
        } )
    }

    Sidepanel.prototype.getExpand = function () {
        return this.model.expand
    }

    Sidepanel.prototype.setExpand = function ( val ) {
        if ( val ) {
            this.model.expand = val
            this.changedSize()
        }
        else {
            this.model.visible = false
            this.model.expand = 0
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

        if ( !tool.makePanelComponent ) return

        this.model.panels.push( tool.makePanelComponent() )
        // this.model.panels.push( {
        //     id:             tool.id,
        //     parentId:       tool.parentId,
        //     type:           tool.type,
        //     panel:          tool.panel,
        //     panelComponent: tool.panelComponent,
        //     titleComponent: tool.titleComponent,
        //     titleProps:     tool.widgetComponent ? { title: tool.title } : tool.widget,
        // } )

        tool.changedActive( function () {
            var was = self.model.visible
            self.model.visible = self.model.panels.some( function ( p ) { return p.prop.active } )

            if ( was == self.model.visible && tool.active )
                self.changedSize()
        } )

        return true
    }

    $.extend( Sidepanel.prototype, SidepanelEvent.prototype )

    SMK.TYPE.Sidepanel = Sidepanel

    return Sidepanel
} )