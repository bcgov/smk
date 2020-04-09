include.module( 'tool-directions-route', [ 
    'tool.tool-panel-js', 
    'tool-directions-route.panel-directions-route-html', 
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
        extends: SMK.COMPONENT.ToolPanel,
        template: inc[ 'tool-directions-route.panel-directions-route-html' ],
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
    function DirectionsRouteTool() {
        SMK.TYPE.ToolPanel.prototype.constructor.call( this, 'route-panel' )

        this.toolProp( 'directions', {
            initial: [],
            forWidget: false
        } )
        this.toolProp( 'directionHighlight', {
            initial: null,
            forWidget: false
        } )
        this.toolProp( 'directionPick', {
            initial: null,
            forWidget: false
        } )

        this.activating = SMK.UTIL.resolved()
    }

    SMK.TYPE.DirectionsRouteTool = DirectionsRouteTool

    $.extend( DirectionsRouteTool.prototype, SMK.TYPE.ToolPanel.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsRouteTool.prototype.afterInitialize = SMK.TYPE.ToolPanel.prototype.afterInitialize.concat( function ( smk ) {
        var self = this

        var directions = smk.$tool[ 'directions' ]

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

                self.setMessage( 'Preparing print...', 'progress', null )
                self.busy = true
                SMK.HANDLER.get( self.id, 'print' )( smk, self, key, ev )
                    .then( function () {
                        self.busy = false
                        return self.setMessage( 'Printing...', 'progress', 2000 )
                    } )
                    .catch( function () {
                        self.busy = false
                        return self.setMessage( 'Print failed', 'error', 2000 )
                    } )
            },
        } )

        smk.$viewer.handlePick( 3, function ( location ) {
            if ( !self.active ) return

            directions.active = true

            return false
        } )        
    } )

    // DirectionsRouteTool.prototype.setMessage = function ( message, status, delay ) {
    //     if ( !message ) {
    //         this.status = null
    //         this.message = null
    //         return
    //     }

    //     this.status = status
    //     this.message = message

    //     if ( delay === null ) return

    //     this.clearMessage.option.delay = delay || 2000
    //     this.clearMessage()
    // }

    // DirectionsRouteTool.prototype.clearMessage = SMK.UTIL.makeDelayedCall( function () {
    //     this.status = null
    //     this.message = null        
    // }, { delay: 2000 } )

    return DirectionsRouteTool

    // function makeDataUrl( img ) {
    //     // Create an empty canvas element
    //     var canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    
    //     // Copy the image contents to the canvas
    //     var ctx = canvas.getContext("2d");
    //     try {
    //         ctx.drawImage(img, 0, 0);
    //     }
    //     catch ( e ) {
    //         ctx.drawImage(img.children[0], 0, 0);
    //     }
    
    //     // Get the data-URL formatted image
    //     // Firefox supports PNG and JPEG. You could check img.src to
    //     // guess the original format, but be aware the using "image/jpg"
    //     // will re-encode the image.
    //     var dataURL = canvas.toDataURL("image/png");
    
    //     return dataURL //.replace(/^data:image\/(png|jpg);base64,/, "");
    // }    
} )

