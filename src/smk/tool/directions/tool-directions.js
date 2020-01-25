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

    var base = include.option( 'baseUrl' ) + '/images/tool/directions'

    var routerApi = inc[ 'tool-directions.router-api-js' ]
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'directions-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'directions-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-directions.panel-directions-html' ],
        props: [ 'waypoints', 'hasRoute', 'optimal' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function DirectionsTool( option ) {
        this.makePropWidget( 'icon', null ) 

        this.makePropPanel( 'waypoints', [] )
        this.makePropPanel( 'hasRoute', false )
        this.makePropPanel( 'optimal', false )

        SMK.TYPE.PanelTool.prototype.constructor.call( this, $.extend( {
            // order:          4,
            // position:       'menu',
            // title:          'Route Planner',
            widgetComponent:'directions-widget',
            panelComponent: 'directions-panel',
            apiKey:         null,
            layers:         [
                {
                    // type: "vector",
                    id: "@segments",
                    // isVisible: true,
                    title: "Segments",
                    style: {
                        strokeColor: "blue",
                        strokeWidth: 8,
                        strokeOpacity: 0.8
                    }
                },
                {
                    // type: "vector",
                    id: "@waypoint-start",
                    // isVisible: true,
                    title: "Starting Location",
                    style: {
                        markerUrl:      base + '/marker-icon-green.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    }
                },
                {
                    // type: "vector",
                    id: "@waypoint-end",
                    // isVisible: true,
                    title: "Ending Location",
                    style: {
                        markerUrl:      base + '/marker-icon-red.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    }
                },
                {
                    // type: "vector",
                    id: "@waypoint-middle",
                    // isVisible: true,
                    title: "Waypoint",
                    style: {
                        markerUrl:      base + '/marker-icon-blue.png',
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      base + '/marker-shadow.png',
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    }
                }
            ]
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

                self.optimal = self.routeOptions.optimal
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
                }
            },

            'route': function ( ev ) {
                self.routePanel.active = true
            },

            'options': function ( ev ) {
                self.routeOptions.active = true
            }
        } )

        routerApi.setApiKey( this.apiKey )

        this.layer = {}
        this.layers.forEach( function ( ly ) {
            ly.type = 'vector'
            ly.isVisible = true
            ly.isInteral = true

            self.layer[ ly.id ] = ly

            ly.display = smk.$viewer.addLayer( ly )
            smk.$layerItems.push( ly.display )
        } )
        // this.segmentLayerDisplay = smk.$viewer.addLayer( {
        //     type: 'vector',
        //     id: '@directions-segments',
        //     isVisible: true,
        //     title: 'Route Segments',
        //     // dataUrl: "data:application/json,{}",
        //     // dataUrl: "data:application/json,{\"type\":\"Feature\",\"properties\":{\"index\":1,\"isFerry\":false,\"isTruckRoute\":true,\"isOversize\":false},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[-123.36249,48.42432],[-123.36227,48.42512],[-123.36207,48.42597],[-123.36184,48.42685],[-123.36162,48.42772],[-123.36192,48.42858],[-123.36196,48.42867],[-123.36195,48.42876],[-123.36193,48.42891],[-123.36184,48.42899],[-123.3618,48.42931],[-123.3617,48.43008],[-123.36168,48.43026],[-123.36158,48.43097],[-123.36153,48.43152],[-123.36159,48.43197],[-123.36166,48.43217],[-123.36176,48.43246],[-123.36213,48.43342],[-123.36245,48.43416],[-123.36251,48.43433],[-123.36261,48.43484],[-123.36263,48.43558],[-123.36258,48.43642],[-123.36267,48.43699],[-123.36312,48.43867],[-123.36319,48.43893],[-123.36327,48.43919],[-123.36391,48.44133],[-123.36397,48.44155],[-123.36421,48.44197],[-123.36484,48.44283],[-123.36622,48.44532],[-123.36634,48.44554],[-123.36639,48.44563],[-123.36649,48.44581],[-123.36774,48.44795],[-123.36787,48.44826],[-123.36788,48.44829],[-123.36818,48.44919],[-123.36847,48.44975],[-123.36878,48.45016],[-123.36933,48.45076],[-123.36957,48.45102],[-123.36979,48.45127],[-123.37053,48.45207],[-123.37083,48.45245],[-123.371,48.45279],[-123.37107,48.45302],[-123.37108,48.45362],[-123.37068,48.45461],[-123.3706,48.45505],[-123.37067,48.45548],[-123.37082,48.4558],[-123.37088,48.45589],[-123.37104,48.45615],[-123.37137,48.45643],[-123.37171,48.45664],[-123.37184,48.45672],[-123.37209,48.45684],[-123.37326,48.45737],[-123.37541,48.45835],[-123.37551,48.4584],[-123.37574,48.4585],[-123.37591,48.45858],[-123.37772,48.4594],[-123.37824,48.45969],[-123.37844,48.45986],[-123.37861,48.46007],[-123.37913,48.46148],[-123.37951,48.46253],[-123.38045,48.4651],[-123.38104,48.46673],[-123.38131,48.46769],[-123.38133,48.46777],[-123.38135,48.46783],[-123.3814,48.46799],[-123.38142,48.46808],[-123.3818,48.46946],[-123.38268,48.4722],[-123.38325,48.47371],[-123.3838,48.47492],[-123.38651,48.4809],[-123.38682,48.48173],[-123.38687,48.48219],[-123.38683,48.48265],[-123.38659,48.48328],[-123.38635,48.48371],[-123.38463,48.48677],[-123.38443,48.48751],[-123.3844,48.4879],[-123.38443,48.4883],[-123.38463,48.48898],[-123.38522,48.49035],[-123.38627,48.49278],[-123.38638,48.49304],[-123.38654,48.49368],[-123.38649,48.49428],[-123.38614,48.49526],[-123.38459,48.49797],[-123.38432,48.49873],[-123.38431,48.49884],[-123.38458,48.49886],[-123.38499,48.49889],[-123.38528,48.49891],[-123.38557,48.49893],[-123.38582,48.49895],[-123.38674,48.49902],[-123.38761,48.49909],[-123.388,48.49912],[-123.38883,48.49917],[-123.39099,48.49931],[-123.39134,48.4993],[-123.39175,48.49923],[-123.39255,48.49895],[-123.39404,48.49828],[-123.39491,48.49849],[-123.39557,48.49873],[-123.39612,48.49894],[-123.39691,48.49928],[-123.39717,48.49939],[-123.39762,48.49963],[-123.39803,48.4999],[-123.39828,48.50004],[-123.39908,48.50032],[-123.39938,48.5004],[-123.40056,48.50069],[-123.40139,48.50101],[-123.40218,48.50144],[-123.40235,48.50153],[-123.40423,48.50225],[-123.40512,48.5027],[-123.40537,48.50287],[-123.40557,48.503],[-123.4061,48.50353],[-123.40641,48.50389],[-123.40723,48.50461],[-123.40736,48.50481],[-123.40741,48.50494],[-123.40742,48.50514],[-123.40729,48.50572],[-123.40735,48.50633],[-123.40744,48.50672],[-123.40791,48.50734],[-123.4088,48.50795],[-123.40977,48.50838],[-123.41015,48.50857],[-123.4105,48.50883],[-123.41088,48.50901],[-123.4121,48.50932],[-123.41248,48.50946],[-123.41335,48.51004],[-123.41394,48.51031],[-123.41428,48.51053],[-123.41448,48.51077],[-123.41464,48.51109],[-123.4147,48.51135],[-123.41458,48.51239],[-123.41539,48.51314],[-123.41572,48.514],[-123.41646,48.51448],[-123.41681,48.51478],[-123.41776,48.51517],[-123.41816,48.51527],[-123.41868,48.51534],[-123.41897,48.51545],[-123.42113,48.51682],[-123.42152,48.51707],[-123.4217,48.51728],[-123.42179,48.51751],[-123.42192,48.51788],[-123.42224,48.51848],[-123.42271,48.51915],[-123.42306,48.51951],[-123.42431,48.52031],[-123.42469,48.52049],[-123.42536,48.52104],[-123.42574,48.5213],[-123.42615,48.52151],[-123.42678,48.5217],[-123.42714,48.52186],[-123.42773,48.52245],[-123.42815,48.52276],[-123.42922,48.52322],[-123.43089,48.5239],[-123.43105,48.52403],[-123.43114,48.52409],[-123.43351,48.52588],[-123.43483,48.5266],[-123.43582,48.52709],[-123.43657,48.52751],[-123.43699,48.52785],[-123.43777,48.52868],[-123.43794,48.52896],[-123.43804,48.52912],[-123.43815,48.52929],[-123.43822,48.52961],[-123.4385,48.53097],[-123.43851,48.53187],[-123.43848,48.53215],[-123.43837,48.53249],[-123.43796,48.53313],[-123.43771,48.53389],[-123.43756,48.53452],[-123.43741,48.5351],[-123.43731,48.53543],[-123.43723,48.53567]]}}",
        //     // dataUrl: 'data:application/json,' + JSON.stringify( turf.point( d.point ) ),
        //     // tooltip: {
        //         // title: '#' + d.index,
        //         // option: {
        //             // className: 'smk-route-tooltip ' + ( d.waypointStyle || '' )
        //         // }
        //     // },
        //     style: {
        //         strokeColor: "red",
        //         strokeWidth: 8,
        //         strokeOpacity: 0.8
        //     },
        //     isInternal: true
        //     // legends: false
        // } )
        // this.segmentLayerDisplay.isInternal = true

        // smk.$viewer.layerDisplayContext.addItem( ld, smk.$viewer.layerId )

        // smk.$viewer.updateLayersVisible()
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    DirectionsTool.prototype.addWaypoint = function ( site ) {
        var self = this

        if ( !site || !site.fullAddress )
            return this.setMessage( 'Unable to find address', 'error', 1000 )
                // .then( function () {
                    // self.findRoute()
                // } )

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
        this.displaySegments()

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
            oversize:           this.routeOptions.oversize,  
        }

        return SMK.UTIL.promiseFinally( routerApi.fetchDirections( points, opt ).then( function ( data ) {
            self.displaySegments( data.segments )

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
            
            self.directionsRaw = data
            self.directionsRaw.waypoints = JSON.parse( JSON.stringify( self.waypoints ) )
        } )
        .catch( function ( err ) {
            console.warn( err )
            self.setMessage( 'Unable to find route', 'error' )
            self.displayWaypoints()
        } ), function () {
            self.busy = false
        } )
    }

    DirectionsTool.prototype.displaySegments = function ( segments ) {
        this.layer[ '@segments' ].load( segments )
        // this.segmentLayerDisplay.load( segments )
    }

    DirectionsTool.prototype.displayWaypoints = function () {
        var wl = this.waypoints.length

        this.layer[ '@waypoint-start' ].load()
        this.layer[ '@waypoint-end' ].load()
        this.layer[ '@waypoint-middle' ].load()

        if ( wl > 0 )
            this.layer[ '@waypoint-start' ].load( turf.point( this.waypoints[ 0 ] ) )

        if ( wl > 1 )
            this.layer[ '@waypoint-end' ].load( turf.point( this.waypoints[ wl - 1 ] ) )

        if ( wl > 2 ) {
            this.waypoints.slice( 1, wl - 1 ).forEach( function ( wp ) {
                this.layer[ '@waypoint-middle' ].load( turf.point( wp ) )
            } )
        }
    }

    return DirectionsTool
} )

