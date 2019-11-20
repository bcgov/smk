include.module( 'tool-directions', [ 
    'tool', 
    'widgets', 
    'sidepanel', 
    'tool-directions.panel-directions-html', 
    'tool-directions.router-api-js', 
    'tool-directions-route', 
    'tool-directions-options',
    'widget-address-search'
], function ( inc ) {
    "use strict";

    var routerApi = inc[ 'tool-directions.router-api-js' ]
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'directions-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'directions-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions.panel-directions-html' ],
        props: [ 'waypoints', 'config', 'hasRoute' ],
        data: function () {
            return Object.assign( {}, this.config )
        },
        watch: {
            config: function ( val ) {
                var self = this

                Object.keys( val ).forEach( function ( k ) {
                    self[ k ] = val[ k ]
                } )
            }
        },
        methods: {
            getConfigState: function () {
                var self = this

                var state = {}
                Object.keys( this.config ).forEach( function ( k ) {
                    state[ k ] = self[ k ]
                } )
                return state
            }
        },
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsTool( option ) {
        this.makePropWidget( 'icon', null ) //'directions_car' )

        this.makePropPanel( 'waypoints', [] )
        this.makePropPanel( 'hasRoute', false )
        this.makePropPanel( 'config', {
            optimal:    false,
            roundTrip:  false,
            criteria:   'shortest',
            newAddress: null,
            options:    false
        } )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            // order:          4,
            // position:       'menu',
            // title:          'Route Planner',
            widgetComponent:'directions-widget',
            panelComponent: 'directions-panel',
            apiKey:         null
        }, option ) )

        this.activating = SMK.UTIL.resolved()

        this.directions = []
    }

    SMK.TYPE.DirectionsTool = DirectionsTool

    $.extend( DirectionsTool.prototype, SMK.TYPE.PanelTool.prototype )
    DirectionsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.routePanel = smk.$tool[ 'directions-route' ]
        this.routeOptions = smk.$tool[ 'directions-options' ]

        this.changedActive( function () {
            if ( self.active ) {
                if ( self.waypoints.length == 0 ) {
                    self.activating = self.activating.then( function () {
                        return self.startAtCurrentLocation()
                    } )
                }
                else {
                    self.activating = self.activating.then( function () {
                        return self.findRoute()
                    } )
                }
            }
        } )

        this.getCurrentLocation = function () {
            self.setMessage( 'Finding current location', 'progress' )
            self.busy = true

            return SMK.UTIL.promiseFinally( smk.$viewer.getCurrentLocation(), function () {
                self.busy = false
                self.setMessage()
            } )
        }

        smk.$viewer.handlePick( 2, function ( location ) {
            if ( !self.active ) return

            return SMK.UTIL.findNearestSite( location.map ).then( function ( site ) {
                self.active = true

                return self.activating.then( function () {
                    return self.addWaypoint( site )
                } )
            } )
            .catch( function ( err ) {
                console.warn( err )
                return self.addWaypoint()
            } )
            .then( function () {
                return true
            } )
        } )

        smk.on( this.id, {
            'activate': function () {
                if ( !self.enabled ) return

                self.active = !self.active
            },

            'config': function ( ev ) {
                Object.assign( self.config, ev )

                self.findRoute()
            },

            'reverse': function ( ev ) {
                self.waypoints.reverse()
                self.findRoute()
            },

            'clear': function ( ev ) {
                self.startAtCurrentLocation()
            },

            'hover-direction': function ( ev ) {
                self.directionHighlight = ev.highlight
            },

            'pick-direction': function ( ev ) {
                self.directionPick = ev.pick
            },

            'changed-waypoints': function ( ev ) {
                self.findRoute()
            },

            'remove-waypoint': function ( ev ) {
                self.waypoints.splice( ev.index, 1 )

                self.findRoute()
            },

            'new-waypoint': function ( ev ) {
                if ( ev.latitude ) {
                    self.addWaypoint( ev )

                    Vue.nextTick( function () {
                        self.panel.config = Object.assign( {}, self.panel.config, { newAddress: null } )
                    } )
                }
            },

            'route': function ( ev ) {
                self.routePanel.active = true
                // smk.$tool[ 'directions-route' ].active = true 
            },

            'options': function ( ev ) {
                self.routeOptions.active = true
                // smk.$tool[ 'directions-options' ].active = true 
            }
        } )

        routerApi.setApiKey( this.apiKey )
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsTool.prototype.addWaypoint = function ( site ) {
        var self = this

        if ( !site || !site.fullAddress )
            return this.setMessage( 'Unable to find address', 'error', 1000 )
                .then( function () {
                    self.findRoute()
                } )

        this.waypoints.push( site )

        return this.findRoute()
    }

    DirectionsTool.prototype.startAtCurrentLocation = function () {
        var self = this

        return self.resetWaypoints()
            .then( function () {
                return self.getCurrentLocation()
                    .then( function ( res ) {
                        return self.addWaypoint( res )
                    } )
                    .catch( function () {
                        return self.setMessage( 'Unable to get current location', 'error', 1000 )
                    } )
            } )
    }

    DirectionsTool.prototype.resetWaypoints = function ( ) {
        var self = this

        this.waypoints = []
        this.hasRoute = false

        return this.findRoute()
    }

    DirectionsTool.prototype.findRoute = function () {
        var self = this

        this.directions = []
        this.directionHighlight = null
        this.directionPick = null
        this.setMessage()
        this.displayRoute()

        var points = this.waypoints
            .map( function ( w, i ) { return { index: i, latitude: w.latitude, longitude: w.longitude } } )

        if ( points.length < 2 ) {
            self.displayWaypoints()
            this.setMessage( 'Add a waypoint' )
            return SMK.UTIL.resolved()
        }

        this.setMessage( 'Calculating...', 'progress' )
        this.busy = true
        this.hasRoute = false
      
        var opt = {
            criteria:           this.routeOptions.criteria,
            roundTrip:          this.routeOptions.roundTrip,
            optimal:            this.routeOptions.optimal,
            truck:              this.routeOptions.truck,  
            followTruckRoute:   this.routeOptions.truckRoute > 1,
            truckRouteMultiplier:this.routeOptions.truckRoute,  
            height:             this.routeOptions.truckHeight,  
            weight:             this.routeOptions.truckWeight,  
        }

        return SMK.UTIL.promiseFinally( routerApi.fetchDirections( points, opt ).then( function ( data ) {
            self.displayRoute( data.route )

            if ( data.visitOrder && data.visitOrder.findIndex( function ( v, i ) { return points[ v ].index != i } ) != -1 ) {
                // console.log( data.visitOrder )
                // console.log( data.visitOrder.map( function ( v ) { return points[ v ].index } ) )
                // console.log( JSON.stringify( self.waypoints, null, '  ' ) )

                self.waypoints = data.visitOrder.map( function ( v ) { return self.waypoints[ points[ v ].index ] } )
                // console.log( JSON.stringify( self.waypoints, null, '  ' ) )
                // self.addWaypoint()
            }

            self.displayWaypoints()

            self.setMessage( 'Route travels ' + data.distance + ' km in ' + data.timeText, 'summary' )

            self.hasRoute = true

            self.directions = data.directions
        } )
        .catch( function ( err ) {
            console.warn( err )
            self.setMessage( 'Unable to find route', 'error' )
            self.displayWaypoints()
        } ), function () {
            self.busy = false
        } )
    }

    return DirectionsTool
} )

