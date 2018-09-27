include.module( 'tool-directions-route', [ 'tool', 'widgets', 'tool-directions-route.panel-route-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'route-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-route.panel-route-html' ],
        props: [ 'busy', 'directions', 'directionHighlight', 'directionPick', 'statusMessage' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsRouteTool( option ) {
        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'directions', [] )
        this.makePropPanel( 'directionHighlight', null )
        this.makePropPanel( 'directionPick', null )
        this.makePropPanel( 'statusMessage', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:          4,
            position:       'menu',
            title:          'Route',
            panelComponent: 'route-panel',
        }, option ) )

        this.activating = SMK.UTIL.resolved()
    }

    SMK.TYPE.DirectionsRouteTool = DirectionsRouteTool

    $.extend( DirectionsRouteTool.prototype, SMK.TYPE.Tool.prototype )
    DirectionsRouteTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsRouteTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        var directions = smk.$tool[ 'directions' ]

        this.changedActive( function () {
            if ( self.active ) {
                self.directions = directions.directions
                self.directionHighlight = directions.directionHighlight
                self.directionPick = directions.directionPick
            }

            directions.visible = self.active
        } )

        smk.on( this.id, {
            'hover-direction': function ( ev ) {
                self.directionHighlight = ev.highlight
            },

            'pick-direction': function ( ev ) {
                self.directionPick = ev.pick
            },
        } )

    } )

    DirectionsRouteTool.prototype.setMessage = function ( message, status, delay ) {
        if ( !message ) {
            this.statusMessage = null
            return
        }

        this.statusMessage = {
            message: message,
            status: status
        }

        if ( delay )
            return SMK.UTIL.makePromise( function ( res ) { setTimeout( res, delay ) } )
    }

    return DirectionsRouteTool
} )

