include.module( 'tool-directions.tool-directions-route-js', [
    'tool.tool-base-js',
    'tool.tool-panel-js',
    'tool-directions.panel-directions-route-html',
    'component-command-button',
    'turf'
], function ( inc ) {
    "use strict";

    var instructionType = {
        START:              [ 'trip_origin', null,      'Go on' ],
        START_NORTH:        [ 'trip_origin', null,      'Head north on' ],
        START_SOUTH:        [ 'trip_origin', null,      'Head south on' ],
        START_EAST:         [ 'trip_origin', null,      'Head east on' ],
        START_WEST:         [ 'trip_origin', null,      'Head west on' ],
        CONTINUE:           [ 'expand_more', null,      'Continue onto'  ],
        TURN_LEFT:          [ 'arrow_back', null,       'Turn left onto' ],
        TURN_SLIGHT_LEFT:   [ 'undo', null,             'Slight turn left onto' ],
        TURN_SHARP_LEFT:    [ 'directions', true,       'Sharp turn left onto' ],
        TURN_RIGHT:         [ 'arrow_forward', null,    'Turn right onto' ],
        TURN_SLIGHT_RIGHT:  [ 'undo', true,             'Slight turn right onto' ],
        TURN_SHARP_RIGHT:   [ 'directions', null,       'Sharp turn right onto' ],
        FERRY:              [ 'directions_boat', null,  'Board' ],
        STOPOVER:           [ 'pause', null,            '' ],
        FINISH:             [ 'stop', null,             '' ],
    }

    Vue.component( 'route-panel', {
        extends: SMK.COMPONENT.ToolPanelBase,
        template: inc[ 'tool-directions.panel-directions-route-html' ],
        props: [ 'directions', 'directionHighlight', 'directionPick' ],
        methods: {
            instructionTypeIcon: function ( type ) {
                if ( !instructionType[ type ] ) return 'report'
                return instructionType[ type ][ 0 ]
            },
            instructionTypeClass: function ( type ) {
                if ( !instructionType[ type ] ) return 'smk-hidden'
                return instructionType[ type ][ 1 ] ? 'smk-reverse' : ''
            },
            instructionTypePrefix: function ( type, heading ) {
                if ( heading ) type = type + '_' + heading
                if ( !instructionType[ type ] ) return ''
                return instructionType[ type ][ 2 ] || ''
            },
        }
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return SMK.TYPE.Tool.define( 'DirectionsRouteTool',
        function () {
            SMK.TYPE.ToolPanel.call( this, 'route-panel' )

            this.defineProp( 'directions' )
            this.defineProp( 'directionHighlight' )
            this.defineProp( 'directionPick' )

            this.directions = []

            this.parentId = 'DirectionsWaypointsTool'
        },
        function ( smk ) {
            var self = this

            var directions = smk.getToolById( this.parentId )

            this.changedActive( function () {
                if ( self.active ) {
                    self.directions = directions.directions
                    self.directionHighlight = directions.directionHighlight
                    self.directionPick = directions.directionPick
                }
            } )

            smk.on( this.id, {
                'hover-direction': function ( ev ) {
                    self.directionHighlight = ev.highlight
                },

                'pick-direction': function ( ev ) {
                    self.directionPick = ev.pick
                },

                'print': function ( ev ) {
                    var cfg = smk.getConfig()
                    cfg.etc = {
                        directions: directions.directionsRaw
                    }

                    var key = SMK.UTIL.makeUUID()
                    window.sessionStorage.setItem( key, JSON.stringify( cfg ) )

                    self.showStatusMessage( 'Preparing print...', 'progress', null )
                    self.busy = true
                    SMK.HANDLER.get( self.id, 'print' )( smk, self, key, ev )
                        .then( function () {
                            self.busy = false
                            return self.showStatusMessage( 'Printing...', 'progress', 2000 )
                        } )
                        .catch( function () {
                            self.busy = false
                            return self.showStatusMessage( 'Print failed', 'error', 2000 )
                        } )
                },
            } )

            smk.$viewer.handlePick( 3, function ( location ) {
                if ( !self.active ) return

                directions.active = true

                return false
            } )
        }
    )
} )

