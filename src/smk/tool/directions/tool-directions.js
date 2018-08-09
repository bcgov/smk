include.module( 'tool-directions', [ 'tool', 'widgets', 'tool-directions.panel-directions-html', 'tool-directions.popup-directions-html', 'tool-directions.address-search-html' ], function ( inc ) {
    "use strict";

    var request

    function findRoute( points, option ) {
        if ( request )
            request.abort()

        var query = {
            points:     points.map( function ( w ) { return w.longitude + ',' + w.latitude } ).join( ',' ),
            outputSRS:  4326,
            criteria:   option.criteria,
            roundTrip:  option.roundTrip
        }

        return SMK.UTIL.makePromise( function ( res, rej ) {
            ( request = $.ajax( {
                timeout:    10 * 1000,
                dataType:   'json',
                url:        'https://routerdlv.api.gov.bc.ca/' + ( option.optimal ? 'optimalDirections' : 'directions' ) + '.json',
                data:       query,
                headers: {
                    apikey: option.apiKey
                }
            } ) ).then( res, rej )
        } )
        .then( function ( data ) {
            if ( !data.routeFound ) throw new Error( 'failed to find route' )

            return data
        } )
    }
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
        props: [ 'busy', 'waypoints', 'directions', 'directionHighlight', 'directionPick', 'statusMessage', 'config' ],
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
        this.makePropWidget( 'icon', 'directions_car' )

        this.makePropPanel( 'busy', false )
        this.makePropPanel( 'waypoints', [] )
        this.makePropPanel( 'directions', [] )
        this.makePropPanel( 'directionHighlight', null )
        this.makePropPanel( 'directionPick', null )
        this.makePropPanel( 'statusMessage', null )
        this.makePropPanel( 'config', {
            optimal:    false,
            roundTrip:  false,
            criteria:   'shortest',
            newAddress: null,
            apiKey:     option.apiKey
        } )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            order:          4,
            title:          'Directions',
            widgetComponent:'directions-widget',
            panelComponent: 'directions-panel',
        }, option ) )

        this.activating = SMK.UTIL.resolved()
    }

    SMK.TYPE.DirectionsTool = DirectionsTool

    $.extend( DirectionsTool.prototype, SMK.TYPE.Tool.prototype )
    DirectionsTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        this.changedActive( function () {
            if ( self.active ) {
                smk.withTool( 'location', function () { this.active = false } )

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
            else {
                smk.withTool( 'location', function () { this.active = true } )
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
                if ( !self.visible || !self.enabled ) return

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
        } )

        // = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : = : =

        this.popupModel = {
            site:       null
        }

        this.popupVm = new Vue( {
            el: smk.addToContainer( inc[ 'tool-directions.popup-directions-html' ] ),
            data: this.popupModel,
            methods: {
                formatDD: function ( dd ) {
                    return dd.toFixed( 4 )
                }
            },
            updated: function () {
                if ( this.site )
                    self.updatePopup()
            }
        } )

        this.updatePopup = function () {}

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

        return SMK.UTIL.promiseFinally( findRoute( points, this.config ).then( function ( data ) {
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

            var l = data.directions.length
            self.directions = data.directions.map( function ( dir, i ) {
                dir.instruction = dir.text.replace( /^"|"$/g, '' ).replace( /\sfor\s(\d+.?\d*\sk?m)\s[(](\d+).+?((\d+).+)?$/, function ( m, a, b, c, d ) {
                    dir.distance = a
                    if ( d )
                        dir.time = ( '0' + b ).substr( -2 ) + ':' + ( '0' + d ).substr( -2 )
                    else
                        dir.time = '00:' + ( '0' + b ).substr( -2 )

                    return ''
                } )
                return dir
            } )

            self.directions.unshift( {
                instruction: 'Start!',
                point: [ points[ 0 ].longitude, points[ 0 ].latitude ]
            } )
        } )
        .catch( function ( err ) {
            console.warn( err )
            self.setMessage( 'Unable to find route', 'error' )
            self.displayWaypoints()
        } ), function () {
            self.busy = false
        } )
    }

    DirectionsTool.prototype.setMessage = function ( message, status, delay ) {
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

    return DirectionsTool
} )

