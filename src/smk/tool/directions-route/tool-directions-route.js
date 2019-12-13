include.module( 'tool-directions-route', [ 'tool', 'widgets', 'tool-directions-route.panel-directions-route-html', 'turf' ], function ( inc ) {
    "use strict";

    var instructionType = {
        START:              [ 'trip_origin' ],
        CONTINUE:           [ 'expand_more' ],
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
        props: [ 'busy', 'directions', 'directionHighlight', 'directionPick', 'status', 'message' ],
        methods: {
            instructionTypeIcon: function ( type ) {                
                if ( !instructionType[ type ] ) return 'report'
                return instructionType[ type ][ 0 ]
            },
            instructionTypeClass: function ( type ) {
                if ( !instructionType[ type ] ) return 'smk-hidden'
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
        this.makePropPanel( 'status', null )
        this.makePropPanel( 'message', null )

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
                SMK.HANDLER.get( self.id, 'print' )( smk, self, key )
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

    DirectionsRouteTool.prototype.setMessage = function ( message, status, delay ) {
        if ( !message ) {
            this.status = null
            this.message = null
            return
        }

        this.status = status
        this.message = message

        if ( delay === null ) return

        this.clearMessage.option.delay = delay || 2000
        this.clearMessage()
    }

    DirectionsRouteTool.prototype.clearMessage = SMK.UTIL.makeDelayedCall( function () {
        this.status = null
        this.message = null        
    }, { delay: 2000 } )

    return DirectionsRouteTool

    function makeDataUrl( img ) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        try {
            ctx.drawImage(img, 0, 0);
        }
        catch ( e ) {
            ctx.drawImage(img.children[0], 0, 0);
        }
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        return dataURL //.replace(/^data:image\/(png|jpg);base64,/, "");
    }    
} )

