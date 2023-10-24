include.module( 'viewer', [ 'jquery', 'util', 'event', 'layer', 'feature-set', 'query', 'turf', 'layer-display' ], function () {
    "use strict";

    var ViewerEvent = SMK.TYPE.Event.define( [
        'changedView',
        'changedBaseMap',
        'startedLoading',
        'finishedLoading',
        'pickedLocation',
        'changedLocation',
        'changedPopup',
        'changedLayerVisibility',
        'changedDevice'
    ] )

    function Viewer() {
        var self = this

        ViewerEvent.prototype.constructor.call( this )

        var loading = false
        Object.defineProperty( this, 'loading', {
            get: function () { return loading },
            set: function ( v ) {
                if ( !!v == loading ) return
                // console.log( 'viewer', v )
                loading = !!v
                if ( v )
                    self.startedLoading()
                else
                    self.finishedLoading()
            }
        } )
    }

    SMK.TYPE.Viewer = Viewer

    $.extend( Viewer.prototype, ViewerEvent.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.basemap = {
        BCGov: {
            order: 1,
            apiId: "b1624fea73bd46c681fab55be53d96ae",
            title: 'BC Government'
        },
        BCGovHillshade: {
            order: 2,
            apiId: "bbe05270d3a642f5b62203d6c454f457",
            title: 'BC Government Hillshade'
        },
        Topographic: {
            order: 3,
            apiId: 'ArcGIS:Topographic',
            title: 'ArcGIS Topographic'
        },
        Streets: {
            order: 4,
            apiId: 'ArcGIS:Streets',
            title: 'ArcGIS Streets'
        },
        Imagery: {
            order: 5,
            apiId: 'ArcGIS:Imagery',
            title: 'ArcGIS Imagery'
        },
        Oceans: {
            order: 6,
            apiId: 'ArcGIS:Oceans',
            title: 'ArcGIS Oceans'
        },
        ShadedRelief: {
            order: 7,
            apiId: 'ArcGIS:Hillshade:Light', 
            title: 'ArcGIS Shaded Relief'
        },
        DarkGray: {
            order: 8,
            apiId: 'ArcGIS:DarkGray',
            title: 'ArcGIS Dark Gray'
        },
        Gray: {
            order: 9,
            apiId: 'ArcGIS:LightGray',
            title: 'ArcGIS Gray'
        }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    // for(s=1;s<25;s++){v.map.setZoom(s,{animate:false});console.log(s,v.getScale())}
    Viewer.prototype.zoomScale = []
    Viewer.prototype.zoomScale[  1 ] = 173451547.7127784
    Viewer.prototype.zoomScale[  2 ] = 89690013.7670628
    Viewer.prototype.zoomScale[  3 ] = 45203253.08071528
    Viewer.prototype.zoomScale[  4 ] = 22617698.02495323
    Viewer.prototype.zoomScale[  5 ] = 11314385.218894083
    Viewer.prototype.zoomScale[  6 ] = 5659653.605577067
    Viewer.prototype.zoomScale[  7 ] = 2829913.245708334
    Viewer.prototype.zoomScale[  8 ] = 1414856.836779603
    Viewer.prototype.zoomScale[  9 ] = 707429.7690058348
    Viewer.prototype.zoomScale[ 10 ] = 353715.05331990693
    Viewer.prototype.zoomScale[ 11 ] = 176857.5477505768
    Viewer.prototype.zoomScale[ 12 ] = 88428.77649887519
    Viewer.prototype.zoomScale[ 13 ] = 44214.496444883276
    Viewer.prototype.zoomScale[ 14 ] = 22107.221783884223
    Viewer.prototype.zoomScale[ 15 ] = 11053.61708610345
    Viewer.prototype.zoomScale[ 16 ] = 5526.806585855153
    Viewer.prototype.zoomScale[ 17 ] = 2763.4019883053297
    Viewer.prototype.zoomScale[ 18 ] = 1381.6944712225031
    Viewer.prototype.zoomScale[ 19 ] = 690.8367988270104

    Viewer.prototype.getZoomBracketForScale = function ( scale ) {
        if ( scale > this.zoomScale[ 1 ] ) return [ 0, 1 ]
        if ( scale < this.zoomScale[ 19 ] ) return [ 19, 20 ]
        for ( var z = 2; z < 20; z += 1 )
            if ( scale > this.zoomScale[ z ] ) return [ z - 1, z ]
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.destroy = function () {
        ViewerEvent.prototype.destroy.call( this )
    }

    Viewer.prototype.initialize = function ( smk ) {
        var self = this

        this.lmfId = smk.lmfId
        this.type = smk.viewer.type
        this.serviceUrl = smk.$option[ 'service-url' ]
        this.resolveUrl = function ( url ) {
            return smk.resolveAssetUrl( url )
            // return ( new URL( url, smk.$option.baseUrl ) ).toString()
        }
        this.clusterOption = smk.viewer.clusterOption

        this.identified = new SMK.TYPE.FeatureSet()
        this.selected = new SMK.TYPE.FeatureSet()
        this.searched = new SMK.TYPE.FeatureSet()
        this.queried = {} // new SMK.TYPE.FeatureSet()

        this.layerIds = []
        this.layerId = {}
        this.visibleLayer = {}
        this.layerIdPromise = {}
        this.deadViewerLayer = {}

        this.displayContext = {
            layers: null
        }

        this.pickHandlers = []
        this.query = {}

        this.screenpixelsToMeters = self.pixelsToMillimeters( 100 ) / 1000

        if ( Array.isArray( smk.layers ) ) {
            var items = smk.layers.map( function ( layerConfig ) {
                var ld = self.addLayer( layerConfig )

                if ( layerConfig.queries )
                    layerConfig.queries.forEach( function ( q ) {
                        var query = new SMK.TYPE.Query[ layerConfig.type ]( ld.id, q )

                        self.query[ query.id ] = query
                        self.queried[ query.id ] = new SMK.TYPE.FeatureSet()
                    } )

                return ld
            } )

            self.defaultLayerDisplay = items
        }

        if ( smk.viewer.displayContext ) {
            Object.keys( smk.viewer.displayContext ).forEach( function ( k ) {
                self.setDisplayContextItems( k, smk.viewer.displayContext[ k ] )
            } )
        }

        this.pickedLocation( function ( ev ) {
            var chain = SMK.UTIL.resolved()

            return self.pickHandlers.reduceRight( function ( chain, hs, i ) {
                if ( !hs || hs.length == 0 ) return chain

                return chain.then( function ( handled ) {
                    // console.log( handled, i )
                    if ( handled ) return true

                    return Promise.all( hs.map( function ( h ) {
                        return SMK.UTIL.resolved().then( function () {
                            return h.call( self, ev )
                        } )
                    } ) )
                    .then( function ( handleds ) {
                        // console.log( handleds, i )
                        return handleds.some( function ( h ) { return h } )
                    } )
                } )
            }, SMK.UTIL.resolved() )
                .catch( function ( e ) {
                    console.warn( e )
                } )
        } )

        $( window ).resize( SMK.UTIL.makeDelayedCall( function () {
            var dev = smk.detectDevice()
            if ( dev )
                self.changedDevice( dev )
        }, { delay: 500 } ) )

        if ( smk.$tool[ 'query-place' ] ) {
            self.queried.place = new SMK.TYPE.FeatureSet()

            self.query.place = new SMK.TYPE.Query.place( 'place' )

            self.layerIds.push( 'place' )
            self.layerId[ 'place' ] = {
                id: 'place',
                config: {
                    title: '',
                    popupTemplate: "@feature-place"
                }
            }
        }
        // self.changedDevice( function ( dev ) { console.log( 'device change', dev ) } )

        this.getSidepanelPosition = function () {
            return smk.getSidepanelPosition()
        }

        this.delayedUpdateLayersVisible = SMK.UTIL.makeDelayedCall( function () {
            self.updateLayersVisible().then( function () {
            } )
        } )

        this.changedLayerVisibility( function () {
            self.delayedUpdateLayersVisible()
        } )

        this.layersLoading = SMK.UTIL.resolved()
        var whenFinishedLoading
        this.startedLoading( function () {
            if ( whenFinishedLoading ) {
                whenFinishedLoading[ 1 ]( new Error( 'startedLoading called before finishedLoading' ) )
                whenFinishedLoading = null
            }

            this.layersLoading = SMK.UTIL.makePromise( function ( res, rej ) {
                whenFinishedLoading = [ res, rej ]
            } )
        } )
        if ( this.loading ) {
            console.log( 'already laoding' )
        }

        this.finishedLoading( function () {
            if ( whenFinishedLoading ) {
                whenFinishedLoading[ 0 ]()
                whenFinishedLoading = null
            }
        } )

        this.acquireIdentifyMutex = SMK.UTIL.makeMutex( 'identify' )
    }

    Viewer.prototype.waitFinishedLoading = function () {
        return this.layersLoading
    }

    Viewer.prototype.addLayer = function ( layerConfig ) {
        var self = this

        var ly = createLayer( layerConfig )

        if ( !ly.hasChildren() ) {
            registerLayer( ly )

            return {
                id: ly.id,
            }
        }

        return {
            id: ly.id,
            type: 'folder',
            title: ly.config.title,
            isVisible: ly.config.isVisible,
            isExpanded: false,
            items: ly.childLayerConfigs().map( function ( childConfig ) {
                var cly = createLayer( childConfig )
                registerLayer( cly )
                return {
                    id: cly.id,
                }
            } )
        }

        function createLayer( config ) {
            try {
                if ( !( config.type in SMK.TYPE.Layer ) )
                    throw new Error( 'layer type "' + config.type + '" not defined' )

                if ( !( self.type in SMK.TYPE.Layer[ config.type ] ) )
                    throw new Error( 'layer type "' + config.type + '" not defined for viewer "' + self.type + '"' )

                var ly = new SMK.TYPE.Layer[ config.type ][ self.type ]( config )
                ly.initialize()

                return ly
            }
            catch ( e ) {
                e.message += ', when creating layer id "' + config.id + '"'
                throw e
            }
        }

        function registerLayer( ly ) {
            self.layerIds.push( ly.id )
            self.layerId[ ly.id ] = ly

            ly.startedLoading( function () {
                self.loading = true
            } )

            ly.finishedLoading( function () {
                self.loading = self.anyLayersLoading()
            } )
        }
    }

    Viewer.prototype.getLayerConfig = function () {
        var self = this

        return this.layerIds.map( function( id ) {
            return self.layerId[ id ].getConfig( self.visibleLayer[ id ] )
        } )
    }

    Viewer.prototype.initializeLayers = function ( smk ) {
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.isDisplayContext = function ( context ) {
        return !!this.displayContext[ context ]
    }

    Viewer.prototype.setDisplayContextItems = function ( context, items ) {
        var self = this

        if ( this.isDisplayContext( context ) ) {
            console.warn( 'displayContext ' + context + ' is already defined' )
            return
        }

        var dc = this.displayContext[ context ] = new SMK.TYPE.LayerDisplayContext( items || [], this.layerId )

        dc.changedVisibility( function () {
            self.changedLayerVisibility()
        } )

        this.changedView( function () {
            dc.setView( self.getView() )
        } )
    }

    Viewer.prototype.eachDisplayContext = function ( cb ) {
        var self = this

        Object.keys( this.displayContext ).forEach( function ( context ) {
            cb.call( self, self.displayContext[ context ], context )
        } )
    }

    Viewer.prototype.getDisplayContexts = function () {
        var dcs = []
        var vw = this.getView()
        this.eachDisplayContext( function ( dc, c ) {
            dc.setView( vw )
            dcs.push( dc.root )
        } )

        return dcs
    }

    Viewer.prototype.getDisplayContextConfig = function () {
        var config = {}
        this.eachDisplayContext( function ( dc, c ) {
            config[ c ] = dc.getConfig()
        } )
        return config
    }

    Viewer.prototype.isDisplayContextItemVisible = function ( layerId ) {
        var vis = null
        this.eachDisplayContext( function ( dc ) {
            vis = vis || dc.isItemVisible( layerId )
        } )
        return vis
    }

    Viewer.prototype.getDisplayContextItem = function ( layerId ) {
        var item = null
        this.eachDisplayContext( function ( dc ) {
            item = item || dc.getItem( layerId )
        } )
        return item
    }

    Viewer.prototype.getDisplayContextLayerIds = function () {
        var ids = []
        this.eachDisplayContext( function ( dc ) {
            ids = ids.concat( dc.getLayerIds() )
        } )
        return ids.reverse()
    }

    Viewer.prototype.setDisplayContextItemEnabled = function ( layerId, enabled ) {
        this.eachDisplayContext( function ( dc ) {
            dc.setItemEnabled( layerId, enabled )
        } )
    }

    Viewer.prototype.setDisplayContextLegendsVisible = function ( vis ) {
        this.eachDisplayContext( function ( dc ) {
            dc.setLegendsVisible( vis, this.layerId, this )
        } )
    }

    Viewer.prototype.setDisplayContextFolderExpanded = function ( layerId, expanded ) {
        this.eachDisplayContext( function ( dc ) {
            dc.setFolderExpanded( layerId, expanded )
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.handlePick = function ( priority, handler ) {
        if ( !this.pickHandlers[ priority ] ) this.pickHandlers[ priority ] = []

        this.pickHandlers[ priority ].push( handler )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.updateLayersVisible = function () {
        var self = this

        // if ( !self.layerDisplayContext ) return

        var pending = {}
        self.getDisplayContextLayerIds().forEach( function ( id ) {
            pending[ id ] = true
        } )
        Object.keys( self.visibleLayer ).forEach( function ( id ) {
            pending[ id ] = true
        } )

        var visibleLayers = []
        var merged
        this.getDisplayContextLayerIds().forEach( function ( id, i ) {
            if ( !self.isDisplayContextItemVisible( id )  ) return
                // console.log( 'visible',id )

            var ly = self.layerId[ id ]
            if ( !ly ) return

            if ( !merged ) {
                merged = [ ly ]
                return
            }

            if ( merged[ 0 ].canMergeWith( ly ) ) {
                merged.push( ly )
                return
            }

            visibleLayers.push( merged )
            merged = [ ly ]
        } )
        if ( merged )
            visibleLayers.push( merged )

        var promises = []
        var maxZOrder = visibleLayers.length
        var zIndex = 0;
        visibleLayers.forEach( function (lys) {
            zIndex += 1;
            var cid = lys.map( function ( ly ) { return ly.id } ).join( '##' )

            delete pending[ cid ]
            if ( self.visibleLayer[ cid ] ) {
                self.positionViewerLayer( self.visibleLayer[ cid ], zIndex )
                return
            }

            var p = self.createViewerLayer( cid, lys, zIndex )
                .then( function ( ly ) {
                    self.addViewerLayer( ly )
                    self.positionViewerLayer( ly, zIndex )
                    self.visibleLayer[ cid ] = ly
                    return ly
                } )
                .catch( function ( e ) {
                    console.warn( 'Failed to create layer ' + cid + ':', e )
                    lys.forEach( function ( ly ) {
                        self.setDisplayContextItemEnabled( ly.id, false )
                    } )
                } )

            promises.push( p )
        } )

        Object.assign( this.deadViewerLayer, pending )

        if ( promises.length == 0 )
            self.finishedLoading()

        return SMK.UTIL.waitAll( promises )
    }

    Viewer.prototype.addViewerLayer = function ( viewerLayer ) {
    }

    Viewer.prototype.positionViewerLayer = function ( viewerLayer, zOrder ) {
    }

    Viewer.prototype.createViewerLayer = function ( id, layers, zIndex ) {
        var self = this

        if ( layers.length == 0 )
            throw new Error( 'no layers' )

        var type = layers[ 0 ].config.type

        if ( !layers.every( function ( c ) { return c.config.type == type } ) )
            throw new Error( 'types don\'t match' )

        if ( this.layerIdPromise[ id ] )
            return this.layerIdPromise[ id ]

        if ( !SMK.TYPE.Layer[ type ][ self.type ].create )
            return SMK.UTIL.rejected( new Error( 'can\'t create viewer layer of type "' + type + '"' ) )

        return ( this.layerIdPromise[ id ] = SMK.UTIL.resolved()
            .then( function () {
                // try {
                // console.log( 'create', id, type, self.type)
                return SMK.TYPE.Layer[ type ][ self.type ].create.call( self, layers, zIndex )
                // }
                // catch ( e ) {
                    // console.warn( 'failed to create viewer layer', layers, e )
                    // return SMK.UTIL.rejected( e )
                // }
            } )
            .then( function ( ly ) {
                return self.afterCreateViewerLayer( id, type, layers, ly )
            } ) )
    }

    Viewer.prototype.afterCreateViewerLayer = function ( id, type, layers, viewerLayer ) {
        viewerLayer._smk_type = type
        viewerLayer._smk_id = id
        // console.log( 'afterCreateViewerLayer', id, type )

        return viewerLayer
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.getView = function () {
        throw new Error( 'not implemented' )
    }

    Viewer.prototype.circleInMap = function ( screenCenter, pixelRadius, sides ) {
        var self = this

        return turf.polygon( [
            SMK.UTIL.circlePoints( screenCenter, pixelRadius, sides )
                .map( function ( p ) {
                    return self.screenToMap( p )
                } )
        ] )
    }

    Viewer.prototype.identifyFeatures = function ( location, area ) {
        var self = this

        // var tolerance = this.identifyTool().tolerance || 5
        // var searchArea = this.circleInMap( location.screen, tolerance, 12 )
        // this.temporaryFeature( 'identify', searchArea )

        var view = this.getView()

        this.identified.clear()

        var lock = this.acquireIdentifyMutex()

        if ( !location || !area ) return

        function IdentifyDiscardedError() {
            var e = Error( 'Identify results discarded' )
            e.discarded = true
            return e
        }

        var promises = []
        this.layerIds.forEach( function ( id, i ) {
            var ly = self.layerId[ id ]

            if ( !self.isDisplayContextItemVisible( id ) ) return
            if ( ly.config.isQueryable === false ) return
            if ( !ly.inScaleRange( view ) ) return

            var option = {
                // tolerance: ly.config.tolerance || tolerance,
                layer: self.visibleLayer[ id ]
            }

            // if ( option.tolerance != tolerance )
                // layerSearchArea = self.circleInMap( location.screen, option.tolerance, 12 )
            // self.temporaryFeature( 'identify', layerSearchArea )

            var p = ly.getFeaturesInArea( area, view, option )
            if ( !p ) return

            promises.push(
                SMK.UTIL.resolved().then( function () {
                    if ( !lock.held() ) throw IdentifyDiscardedError()

                    return p
                } )
                .then( function ( features ) {
                    if ( !lock.held() ) throw IdentifyDiscardedError()

                    features.forEach( function ( f, i ) {
                        if ( ly.config.titleAttribute ) {
                            var m = ly.config.titleAttribute.match( /^(.+?)(:[/](.+)[/])?$/ )
                            if ( m ) {
                                if ( !m[ 2 ] )
                                    f.title = f.properties[ m[ 1 ] ]
                                else
                                    try {
                                        f.title = f.properties[ m[ 1 ] ].match( new RegExp( m[ 3 ] ) )[ 1 ]
                                    }
                                    catch ( e ) {
                                        console.warn( e, m )
                                    }
                            }
                        }

                        if ( !f.title )
                            f.title = 'Feature #' + ( i + 1 )

                        return f
                    } )

                    return features
                } )
                .then( function ( features ) {
                    if ( !lock.held() ) throw IdentifyDiscardedError()

                    features.forEach( function ( f ) {
                        f._identifyPoint = location.map
                    } )
                    self.identified.add( id, features )
                } )
                .catch( function ( err ) {
                    console.debug( id, 'identify fail:', err.message )
                    if ( err.discarded ) throw err
                } )
            )
        } )

        return SMK.UTIL.waitAll( promises )
            .finally( function () {
                if ( !lock.held() ) throw IdentifyDiscardedError()
            } )
}
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.anyLayersLoading = function () {
        var self = this

        return this.layerIds.some( function ( id ) {
            return self.layerId[ id ].loading
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.resolveAttachmentUrl = function ( url, id, type, required ) {
        if ( url && url.startsWith( '@' ) ) {
            id = url.substr( 1 )
            url = null
        }

        if ( url )
            return url

        if ( !id ) {
            if ( required !== false )
                throw new Error( 'attachment without URL or Id' )
            return
        }

        if ( !this.serviceUrl )
            return this.resolveUrl( 'attachments/' + id + ( type ? '.' + type : '' ) )
        else
            return this.serviceUrl + '/MapConfigurations/' + this.lmfId + '/Attachments/' + id
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.pixelsToMillimeters = ( function () {
        var e = document.createElement( 'div' )
        e.style = 'height:1mm; display:none'
        e.id = 'heightRef'
        document.body.appendChild( e )

        var pixPerMillimeter = $( '#heightRef' ).height()

        e.parentNode.removeChild( e )

        return function ( pixels ) {
            return pixels / pixPerMillimeter
        }
    } )()

    Viewer.prototype.distanceToMeters = function ( distance, distanceUnit ) {
        if ( distanceUnit == 'px' )
            return distance * this.getView().metersPerPixel
            // return this.pixelsToMillimeters( distance ) / 1000

        return distance * SMK.UTIL.getMetersPerUnit( distanceUnit )
    }

    Viewer.prototype.distanceFromMeters = function ( distanceMeters, distanceUnit ) {
        if ( distanceUnit == 'px' )
            return distanceMeters / this.getView().metersPerPixel
            // return this.pixelsToMillimeters( distance ) / 1000

        return distanceMeters / SMK.UTIL.getMetersPerUnit( distanceUnit )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Viewer.prototype.getCurrentLocation = function ( option ) {
        var self = this

        option = Object.assign( {
            timeout:         10 * 1000,
            maxAge:     10 * 60 * 1000,
            cacheKey:   'smk-location'
        }, option )

        if ( this.currentLocationPromise && ( !this.currentLocationTimestamp || this.currentLocationTimestamp > ( ( new Date() ).getTime() - option.maxAge ) ) )
            return this.currentLocationPromise

        this.currentLocationTimestamp = null
        return ( this.currentLocationPromise = SMK.UTIL.makePromise( function ( res, rej ) {
            navigator.geolocation.getCurrentPosition( res, rej, {
                timeout:            option.timeout,
                enableHighAccuracy: true,
            } )
            setTimeout( function () { rej( new Error( 'timeout' ) ) }, option.timeout )
        } )
        .then( function ( pos ) {
            self.currentLocationTimestamp = ( new Date() ).getTime()
            window.localStorage.setItem( option.cacheKey, JSON.stringify( { latitude: pos.coords.latitude, longitude: pos.coords.longitude } ) )
            return pos.coords
        } )
        .catch( function ( err ) {
            try {
                var coords = JSON.parse( window.localStorage.getItem( option.cacheKey ) )
                if ( coords && coords.latitude ) {
                    console.warn( 'using cached location', coords )
                    return coords
                }
            }
            catch ( e ) {}
            return Promise.reject( err )
        } )
        .then( function ( loc ) {
            return SMK.UTIL.findNearestSite( loc )
                .then( function ( site ) {
                    site.current = true
                    return site
                } )
        } ) )
    }

} )