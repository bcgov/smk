include.module( 'tool-directions-route', [ 'tool', 'widgets', 'tool-directions-route.panel-directions-route-html' ], function ( inc ) {
    "use strict";

    var instructionType = {
        START:              [ 'play_arrow' ],
        CONTINUE:           [ 'arrow_upward' ],
        TURN_LEFT:          [ 'arrow_back' ],
        TURN_SLIGHT_LEFT:   [ 'undo' ],
        TURN_SHARP_LEFT:    [ 'directions', true ],
        TURN_RIGHT:         [ 'arrow_forward' ],
        TURN_SLIGHT_RIGHT:  [ 'undo', true ],
        TURN_SHARP_RIGHT:   [ 'directions' ],
        FERRY:              [ 'directions_boat' ],
        STOPOVER:           [ 'pause' ],
        FINISH:             [ 'stop' ],
    }

    Vue.component( 'route-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-route.panel-directions-route-html' ],
        props: [ 'busy', 'directions', 'directionHighlight', 'directionPick', 'statusMessage' ],
        methods: {
            instructionTypeIcon: function ( type ) {                
                if ( !instructionType[ type ] ) return type
                return instructionType[ type ][ 0 ]
            },
            instructionTypeClass: function ( type ) {
                if ( !instructionType[ type ] ) return ''
                return instructionType[ type ][ 1 ] ? 'smk-reverse' : ''
            }                
        }
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
            // subPanel:       1,
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

            Vue.nextTick( function () {
                directions.visible = self.active
            } )
        } )

        smk.on( this.id, {
            'hover-direction': function ( ev ) {
                self.directionHighlight = ev.highlight
            },

            'pick-direction': function ( ev ) {
                self.directionPick = ev.pick
            },
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            directions.active = true

            return false
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

