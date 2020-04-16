include.module( 'viewer-leaflet', [ 'viewer', 'leaflet', 'layer-leaflet', 'feature-list-leaflet', 'turf' ], function () {
    "use strict";

    function ViewerLeaflet() {
        SMK.TYPE.Viewer.prototype.constructor.apply( this, arguments )
    }

    if ( !SMK.TYPE.Viewer ) SMK.TYPE.Viewer = {}
    SMK.TYPE.Viewer.leaflet = ViewerLeaflet

    $.extend( ViewerLeaflet.prototype, SMK.TYPE.Viewer.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerLeaflet.prototype.initialize = function ( smk ) {
        var self = this

        SMK.TYPE.Viewer.prototype.initialize.apply( this, arguments )

        this.deadViewerLayer = {}

        var el = smk.addToContainer( '<div class="smk-viewer">' )

        self.map = L.map( el, {
            dragging:           false,
            zoomControl:        false,
            boxZoom:            false,
            doubleClickZoom:    false,
            zoomSnap:           0,
            minZoom:            smk.viewer.minZoom
        } )

        self.map.scrollWheelZoom.disable()

        if ( smk.viewer.location.extent ) {
            var bx = smk.viewer.location.extent
            self.map.fitBounds( [ [ bx[ 1 ], bx[ 0 ] ], [ bx[ 3 ], bx[ 2 ] ] ] )
        }

        if ( smk.viewer.location.zoom ) {
            self.map.setZoom( smk.viewer.location.zoom, { animate: false } )
        }

        if ( smk.viewer.location.center ) {
            self.map.panTo( [ smk.viewer.location.center[ 1 ], smk.viewer.location.center[ 0 ] ], { animate: false } )
        }

        if ( smk.viewer.baseMap ) {
            self.setBasemap( smk.viewer.baseMap )
        }

        function changedView( ev) {
            return function () {
                self.changedView( ev )
            }
        }

        self.map.on( 'zoomstart', changedView( { operation: 'zoom', after: 'start' } ) )
        self.map.on( 'movestart', changedView( { operation: 'move', after: 'start' } ) )
        self.map.on( 'zoomend', changedView( { operation: 'zoom', after: 'end' } ) )
        self.map.on( 'moveend', changedView( { operation: 'move', after: 'end' } ) )
        changedView()()

        self.finishedLoading( function () {
            self.map.eachLayer( function ( ly ) {
                if ( !ly._smk_id ) return

                if ( self.deadViewerLayer[ ly._smk_id ] ) {
                    self.map.removeLayer( ly )
                    delete self.visibleLayer[ ly._smk_id ]
                    // console.log( 'remove', ly._smk_id )
                }
            } )

            Object.keys( self.deadViewerLayer ).forEach( function ( id ) {
                delete self.deadViewerLayer[ id ]
                delete self.visibleLayer[ id ]
                // console.log( 'dead', id )
            } )
        } )

        self.map.on( 'click', function ( ev ) {
            self.pickedLocation( {
                map:    { latitude: ev.latlng.lat, longitude: ev.latlng.lng },
                screen: ev.containerPoint,
            } )
        } )

        self.map.on( 'mousemove', function ( ev ) {
            self.changedLocation( {
                map:    { latitude: ev.latlng.lat, longitude: ev.latlng.lng },
                screen: ev.containerPoint,
            } )
        } )

        self.getVar = function () { return smk.getVar.apply( smk, arguments ) }
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerLeaflet.prototype.getScale = function () {
        var size = this.map.getSize()

        var vertical = size.y / 2,
            mapDist = this.map.distance(
                this.map.containerPointToLatLng( [ 0,   vertical ] ),
                this.map.containerPointToLatLng( [ 100, vertical ] )
            )

        return mapDist / this.screenpixelsToMeters
    }

    ViewerLeaflet.prototype.getView = function () {
        var self = this

        var b = this.map.getBounds()
        var size = this.map.getSize()
        var c = this.map.getCenter()

        var vertical = size.y / 2,
            mapDist = this.map.distance(
                this.map.containerPointToLatLng( [ 0,   vertical ] ),
                this.map.containerPointToLatLng( [ 100, vertical ] )
            )

        return {
            center: { latitude: c.lat, longitude: c.lng },
            zoom: this.map.getZoom(),
            extent: [ b.getWest(), b.getSouth(), b.getEast(), b.getNorth() ],
            scale: mapDist / this.screenpixelsToMeters,
            metersPerPixel: mapDist / 100,
            screen: {
                width:  size.x,
                height: size.y
            },
            // metersPerPixelAtY: function ( vertical ) {
            //     return self.map.distance( self.map.containerPointToLatLng( [ 0, vertical ] ), self.map.containerPointToLatLng( [ 100, vertical ] ) ) / 100
            // }
        }
    }

    ViewerLeaflet.prototype.screenToMap = function ( screen ) {
        var ll
        if ( Array.isArray( screen ) )
            ll = this.map.containerPointToLatLng( screen )
        else
            ll = this.map.containerPointToLatLng( [ screen.x, screen.y ] )

        return [ ll.lng, ll.lat ]
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerLeaflet.prototype.basemap.ShadedRelief.labels = [ 'ShadedReliefLabels' ]
    ViewerLeaflet.prototype.basemap.Gray.labels = [ 'GrayLabels' ]
    ViewerLeaflet.prototype.basemap.DarkGray.labels = [ 'DarkGrayLabels' ]
    ViewerLeaflet.prototype.basemap.Imagery.labels = [ 'ImageryTransportation', 'ImageryLabels' ]
    ViewerLeaflet.prototype.basemap.Oceans.labels = [ 'OceansLabels' ]
    // ViewerLeaflet.prototype.basemap.Terrain.labels = [ 'TerrainLabels' ]

    ViewerLeaflet.prototype.setBasemap = function ( basemapId ) {
        var self = this

        if( this.currentBasemap ) {
            this.currentBasemap.forEach( function ( ly ) {
                self.map.removeLayer( ly );
            } )
        }

        this.currentBasemap = this.createBasemapLayer( basemapId );

        this.map.addLayer( this.currentBasemap[ 0 ] );
        this.currentBasemap[ 0 ].bringToBack();

        for ( var i = 1; i < this.currentBasemap.length; i += 1 )
            this.map.addLayer( this.currentBasemap[ i ] );

        this.changedBaseMap( { baseMap: basemapId } )
    }

    ViewerLeaflet.prototype.createBasemapLayer = function ( basemapId ) {
        var opt = Object.assign( { detectRetina: true }, this.basemap[ basemapId ].option )

        var lys = []
        lys.push( L.esri.basemapLayer( basemapId, opt ) )

        if ( this.basemap[ basemapId ].labels )
            this.basemap[ basemapId ].labels.forEach( function ( id ) {
                lys.push( L.esri.basemapLayer( id, opt ) )
            } )

        return lys
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerLeaflet.prototype.addViewerLayer = function ( viewerLayer ) {
        this.map.addLayer( viewerLayer )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    ViewerLeaflet.prototype.getPanelPadding = function ( panelVisible ) {
        var sbp = this.getSidepanelPosition()
        var size = this.map.getSize()

        var aboveHeight = sbp.top,
            belowHeight = size.y - sbp.top - sbp.height,
            leftWidth = sbp.left,
            rightWidth = size.x - sbp.left - sbp.width

        if ( Math.max( aboveHeight, belowHeight ) > Math.max( leftWidth, rightWidth ) ) {
            if ( aboveHeight > belowHeight ) 
                return {
                    topLeft: L.point( 0, 0 ),
                    bottomRight: L.point( 0, size.y - sbp.top )
                }
            else
                return {
                    topLeft: L.point( 0, sbp.top + sbp.height ),
                    bottomRight: L.point( 0, 0 )
                }
        }
        else {
            if ( leftWidth > rightWidth ) 
                return {
                    topLeft: L.point( 0, 0 ),
                    bottomRight: L.point( size.x - sbp.left, 0 )
                }
            else
                return {
                    topLeft: L.point( sbp.left + sbp.width, 0 ),
                    bottomRight: L.point( 0, 0 )
                }
        }
    }

    ViewerLeaflet.prototype.mapResized = SMK.UTIL.makeDelayedCall( function () { 
        this.map.invalidateSize() 
    }, { delay: 50 } )

    ViewerLeaflet.prototype.temporaryFeature = function ( acetate, geometry, opt ) {
        if ( !this.acetate ) this.acetate = {}
        if ( !this.acetate[ acetate ] ) this.acetate[ acetate ] = L.layerGroup().addTo( this.map )

        this.acetate[ acetate ].clearLayers()

        if ( geometry ) {
            this.acetate[ acetate ].addLayer( L.geoJSON( geometry, opt ) )
        }
    }

    ViewerLeaflet.prototype.panToFeature = function ( feature ) {
        var bounds
        switch ( turf.getType( feature ) ) {
        case 'Point':
            var ll = L.latLng( feature.geometry.coordinates[ 1 ], feature.geometry.coordinates[ 0 ] )
            bounds = L.latLngBounds( [ ll, ll ] )
            break;

        // default:
            // if ( self.highlight[ feature.id ] )
                // bounds = self.highlight[ feature.id ].getBounds()
        }

        if ( !bounds ) return

        // var old = self.featureSet.pick( null )

        var padding = this.getPanelPadding()

        this.map
            // .once( 'zoomend moveend', function () {
                // if ( old )
                    // self.featureSet.pick( old )
            // } )
            .fitBounds( bounds, {
                paddingTopLeft: padding.topLeft,
                paddingBottomRight: padding.bottomRight,
                maxZoom: this.map.getZoom(),        
                animate: true
            } )
    } 

    // ViewerLeaflet.prototype.zoomToFeature = function ( layer, feature ) {
    //     this.map.fitBounds( feature.highlightLayer.getBounds(), {
    //         paddingTopLeft: L.point( 300, 100 ),
    //         animate: false
    //     } )
    // }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    // ViewerLeaflet.prototype.getCurrentLocation = function () {
    //     var self = this

    //     return SMK.UTIL.makePromise( function ( res, rej ) {
    //         self.map.on( {
    //             locationfound: res,
    //             locationerror: rej
    //         } )
    //         self.map.locate( { maximumAge: 10 * 1000 } )
    //     } )
    //     .finally( function () {
    //         self.map.off( 'locationfound' )
    //         self.map.off( 'locationerror' )
    //     } )
    //     .then( function ( ev ) {
    //         return {
    //             map: {
    //                 latitude: ev.latlng.lat,
    //                 longitude: ev.latlng.lng
    //             }
    //         }
    //     } )
    // }
} )

