include.module( 'tool-directions', [ 
    'tool', 
    'widgets', 
    'sidepanel', 
    'tool-directions.panel-directions-html', 
    'tool-directions.address-search-html', 
    'tool-directions.router-api-js', 
    'tool-directions-route', 
    'tool-directions-options'  
], function ( inc ) {
    "use strict";

    var routerApi = inc[ 'tool-directions.router-api-js' ]
    // var request

    // function interpolate( p1, p2, t ) {
    //     return [
    //         p1[ 0 ] + ( p2[ 0 ] - p1[ 0 ] ) * t,
    //         p1[ 1 ] + ( p2[ 1 ] - p1[ 1 ] ) * t
    //     ]
    // }

    // function findRoute( points, option, apiKey ) {
    //     if ( request )
    //         request.abort()

    //     var query = {
    //         points:     points.map( function ( w ) { return w.longitude + ',' + w.latitude } ).join( ',' ),
    //         outputSRS:  4326,
    //         criteria:   option.criteria,
    //         roundTrip:  option.roundTrip
    //     }

    //     return SMK.UTIL.makePromise( function ( res, rej ) {
    //         ( request = $.ajax( {
    //             timeout:    10 * 1000,
    //             dataType:   'json',
    //             // url:        'https://routerdlv.api.gov.bc.ca/' + ( option.optimal ? 'optimalDirections' : 'directions' ) + '.json',
    //             url:        'https://router.api.gov.bc.ca/' + ( option.optimal ? 'optimalDirections' : 'directions' ) + '.json',
    //             data:       query,
    //             headers: {
    //                 apikey: apiKey
    //             }
    //         } ) ).then( res, rej )
    //     } )
    //     .then( function ( data ) {
    //         if ( !data.routeFound ) throw new Error( 'failed to find route' )

    //         return data
    //     } )
    //     // uncomment to inject dummy results
    //     .catch( function () {
    //         return {
    //             distance: '10',
    //             timeText: '10 mins',
    //             route: points.map( function ( p ) { return [ p.longitude, p.latitude ] } ),
    //             directions: points
    //                 .map( function ( p ) {
    //                     return { text: 'waypoint: ' + p.longitude + ', ' + p.latitude, point: [ p.longitude, p.latitude ] }
    //                 } )
    //                 .reduce( function ( accum, v ) {
    //                     if ( accum.length == 0 ) {
    //                         accum.push( v )
    //                         return accum
    //                     }

    //                     var prev = accum[ accum.length - 1 ]

    //                     accum.push( { text: 'turn left for 1km (1:00)', point: interpolate( prev.point, v.point, 0.2 ) } )
    //                     accum.push( { text: 'go straight for 2km (2:00)', point: interpolate( prev.point, v.point, 0.4 ) } )
    //                     accum.push( { text: 'turn right for 3km (3:00)', point: interpolate( prev.point, v.point, 0.6 ) } )
    //                     accum.push( { text: 'go backwards for 4km (4:00)', point: interpolate( prev.point, v.point, 0.8 ) } )
    //                     accum.push( v )

    //                     return accum 
    //                 }, [] )
    //         }
    //     } )
    // }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'address-search', {
        template: inc[ 'tool-directions.address-search-html' ],
        props: [ 'value', 'placeholder' ],
        data: function () {
            return {
                search: this.value,
                list: null,
                selectedIndex: null,
                expanded: false
            }
        },
        watch: {
            value: function ( val ) {
                this.search = this.value
            }
        },
        methods: {
            onChange: function () {
                var self = this

                this.$emit( 'input', this.search )
                this.$emit( 'update', { fullAddress: this.search } )

                this.list = null

                var query = {
                    ver:            1.2,
                    maxResults:     20,
                    outputSRS:      4326,
                    addressString:  this.search,
                    autoComplete:   true
                }

                return SMK.UTIL.makePromise( function ( res, rej ) {
                    $.ajax( {
                        timeout:    10 * 1000,
                        dataType:   'jsonp',
                        url:        'https://apps.gov.bc.ca/pub/geocoder/addresses.geojsonp', 
                        data:       query,
                    } ).then( res, rej )
                } )
                .then( function ( data ) {
                    self.list = $.map( data.features, function ( feature ) {
                        if ( !feature.geometry.coordinates ) return;

                        // exclude whole province match
                        if ( feature.properties.fullAddress == 'BC' ) return;

                        return {
                            longitude:           feature.geometry.coordinates[ 0 ],
                            latitude:            feature.geometry.coordinates[ 1 ],
                            civicNumber:         feature.properties.civicNumber,
                            civicNumberSuffix:   feature.properties.civicNumberSuffix,
                            fullAddress:         feature.properties.fullAddress,
                            localityName:        feature.properties.localityName,
                            localityType:        feature.properties.localityType,
                            streetName:          feature.properties.streetName,
                            streetType:          feature.properties.streetType,
                        }
                    } )

                    self.expanded = self.list.length > 0
                    self.selectedIndex = self.list.length > 0 ? 0 : null
                } )
            },

            onArrowDown: function () {
                if ( !this.expanded && this.list ) {
                    this.expanded = true
                    this.selectedIndex = 0
                    return
                }
                this.selectedIndex = ( ( this.selectedIndex || 0 ) + 1 ) % this.list.length
            },

            onArrowUp: function () {
                if ( !this.expanded ) return
                this.selectedIndex = ( ( this.selectedIndex || 0 ) + this.list.length - 1 ) % this.list.length
            },

            onEnter: function () {
                if ( !this.expanded ) return
                this.search = this.list[ this.selectedIndex ].fullAddress
                this.expanded = false
                this.$emit( 'update', this.list[ this.selectedIndex ] )
            },

            handleClickOutside: function ( ev ) {
                if ( this.$el.contains( ev.target ) ) return

                this.expanded = false
                this.selectedIndex = null
            }
        },
        mounted: function () {
            document.addEventListener( 'click', this.handleClickOutside )
        },
        destroyed: function () {
            document.removeEventListener( 'click', this.handleClickOutside )
        }
    } )
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
      
        // return SMK.UTIL.promiseFinally( findRoute( points, this.config, this.apiKey ).then( function ( data ) {
        var opt = {
            criteria:           this.routeOptions.criteria,
            roundTrip:          this.routeOptions.roundTrip,
            optimal:            this.routeOptions.optimal,
            // truck:              this.routeOptions.criteria,  
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

            // var l = data.directions.length
            // self.directions = data.directions.map( function ( dir, i ) {
            //     dir.instruction = dir.text.replace( /^"|"$/g, '' ).replace( /\sfor\s(\d+.?\d*\sk?m)\s[(](\d+).+?((\d+).+)?$/, function ( m, a, b, c, d ) {
            //         dir.distance = a
            //         if ( d )
            //             dir.time = ( '0' + b ).substr( -2 ) + ':' + ( '0' + d ).substr( -2 )
            //         else
            //             dir.time = '00:' + ( '0' + b ).substr( -2 )

            //         return ''
            //     } )
            //     return dir
            // } )

            self.hasRoute = true

            // self.directions.unshift( {
            //     instruction: 'Start!',
            //     point: [ points[ 0 ].longitude, points[ 0 ].latitude ]
            // } )

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

