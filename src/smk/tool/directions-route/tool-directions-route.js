include.module( 'tool-directions-route', [ 'tool', 'widgets', 'tool-directions-route.panel-route-html', 'tool-directions-route.popup-directions-html' ], function ( inc ) {
    "use strict";

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    // Vue.component( 'directions-widget', {
    //     extends: inc.widgets.toolButton,
    // } )

    Vue.component( 'route-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions-route.panel-route-html' ],
        props: [ 'busy', 'directions', 'directionHighlight', 'directionPick', 'statusMessage' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsRouteTool( option ) {
        // this.makePropWidget( 'icon', 'directions_car' )

        this.makePropPanel( 'busy', false )
        // this.makePropPanel( 'waypoints', [] )
        this.makePropPanel( 'directions', [] )
        this.makePropPanel( 'directionHighlight', null )
        this.makePropPanel( 'directionPick', null )
        this.makePropPanel( 'statusMessage', null )
        // this.makePropPanel( 'config', {
        //     optimal:    false,
        //     roundTrip:  false,
        //     criteria:   'shortest',
        //     newAddress: null,
        //     apiKey:     option.apiKey,
        //     options:    false
        // } )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:          4,
            position:       'menu',
            title:          'Route',
            // widgetComponent:'directions-widget',
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

        // this.getCurrentLocation = function () {
        //     self.setMessage( 'Finding current location', 'progress' )
        //     self.busy = true

        //     return SMK.UTIL.promiseFinally( smk.$viewer.getCurrentLocation(), function () {
        //         self.busy = false
        //         self.setMessage()
        //     } )
        // }

        // smk.$viewer.handlePick( 2, function ( location ) {
        //     if ( !self.active ) return

        //     return SMK.UTIL.findNearestSite( location.map ).then( function ( site ) {
        //         self.active = true

        //         return self.activating.then( function () {
        //             return self.addWaypoint( site )
        //         } )
        //     } )
        //     .catch( function ( err ) {
        //         console.warn( err )
        //         return self.addWaypoint()
        //     } )
        //     .then( function () {
        //         return true
        //     } )
        // } )

        smk.on( this.id, {
        //     'activate': function () {
        //         if ( !self.enabled ) return

        //         self.active = !self.active
        //     },

        //     'config': function ( ev ) {
        //         Object.assign( self.config, ev )

        //         self.findRoute()
        //     },

        //     // 'options': function ( ev ) {
        //     //     self.options = !self.options
        //     // },

        //     'reverse': function ( ev ) {
        //         self.waypoints.reverse()
        //         self.findRoute()
        //     },

        //     'clear': function ( ev ) {
        //         self.startAtCurrentLocation()
        //     },

            'hover-direction': function ( ev ) {
                self.directionHighlight = ev.highlight
            },

            'pick-direction': function ( ev ) {
                self.directionPick = ev.pick
            },

        //     'changed-waypoints': function ( ev ) {
        //         self.findRoute()
        //     },

        //     'remove-waypoint': function ( ev ) {
        //         self.waypoints.splice( ev.index, 1 )

        //         self.findRoute()
        //     },

        //     'new-waypoint': function ( ev ) {
        //         if ( ev.latitude ) {
        //             self.addWaypoint( ev )

        //             Vue.nextTick( function () {
        //                 self.panel.config = Object.assign( {}, self.panel.config, { newAddress: null } )
        //             } )
        //         }
        //     },
        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        this.popupModel = {
            site:       null
        }

        this.popupVm = new Vue( {
            el: smk.addToContainer( inc[ 'tool-directions-route.popup-directions-html' ] ),
            data: this.popupModel,
            updated: function () {
                if ( this.site )
                    self.updatePopup()
            }
        } )

        this.updatePopup = function () {}

    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    // DirectionsRouteTool.prototype.addWaypoint = function ( site ) {
    //     var self = this

    //     if ( !site || !site.fullAddress )
    //         return this.setMessage( 'Unable to find address', 'error', 1000 )
    //             .then( function () {
    //                 self.findRoute()
    //             } )

    //     this.waypoints.push( site )

    //     return this.findRoute()
    // }

    // DirectionsRouteTool.prototype.startAtCurrentLocation = function () {
    //     var self = this

    //     return self.resetWaypoints()
    //         .then( function () {
    //             return self.getCurrentLocation()
    //                 .then( function ( res ) {
    //                     return self.addWaypoint( res )
    //                 } )
    //                 .catch( function () {
    //                     return self.setMessage( 'Unable to get current location', 'error', 1000 )
    //                 } )
    //         } )
    // }

    // DirectionsRouteTool.prototype.resetWaypoints = function ( ) {
    //     var self = this

    //     this.waypoints = []

    //     return this.findRoute()
    // }

    // DirectionsRouteTool.prototype.findRoute = function () {
    //     var self = this

    //     this.directions = []
    //     this.directionHighlight = null
    //     this.directionPick = null
    //     this.setMessage()
    //     this.displayRoute()

    //     var points = this.waypoints
    //         .map( function ( w, i ) { return { index: i, latitude: w.latitude, longitude: w.longitude } } )

    //     if ( points.length < 2 ) {
    //         self.displayWaypoints()
    //         this.setMessage( 'Add a waypoint' )
    //         return SMK.UTIL.resolved()
    //     }

    //     this.setMessage( 'Calculating...', 'progress' )
    //     this.busy = true

    //     return SMK.UTIL.promiseFinally( findRoute( points, this.config ).then( function ( data ) {
    //         self.displayRoute( data.route )

    //         if ( data.visitOrder && data.visitOrder.findIndex( function ( v, i ) { return points[ v ].index != i } ) != -1 ) {
    //             // console.log( data.visitOrder )
    //             // console.log( data.visitOrder.map( function ( v ) { return points[ v ].index } ) )
    //             // console.log( JSON.stringify( self.waypoints, null, '  ' ) )

    //             self.waypoints = data.visitOrder.map( function ( v ) { return self.waypoints[ points[ v ].index ] } )
    //             // console.log( JSON.stringify( self.waypoints, null, '  ' ) )
    //             // self.addWaypoint()
    //         }

    //         self.displayWaypoints()

    //         self.setMessage( 'Route travels ' + data.distance + ' km in ' + data.timeText, 'summary' )

    //         var l = data.directions.length
    //         self.directions = data.directions.map( function ( dir, i ) {
    //             dir.instruction = dir.text.replace( /^"|"$/g, '' ).replace( /\sfor\s(\d+.?\d*\sk?m)\s[(](\d+).+?((\d+).+)?$/, function ( m, a, b, c, d ) {
    //                 dir.distance = a
    //                 if ( d )
    //                     dir.time = ( '0' + b ).substr( -2 ) + ':' + ( '0' + d ).substr( -2 )
    //                 else
    //                     dir.time = '00:' + ( '0' + b ).substr( -2 )

    //                 return ''
    //             } )
    //             return dir
    //         } )

    //         self.directions.unshift( {
    //             instruction: 'Start!',
    //             point: [ points[ 0 ].longitude, points[ 0 ].latitude ]
    //         } )
    //     } )
    //     .catch( function ( err ) {
    //         console.warn( err )
    //         self.setMessage( 'Unable to find route', 'error' )
    //         self.displayWaypoints()
    //     } ), function () {
    //         self.busy = false
    //     } )
    // }

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

