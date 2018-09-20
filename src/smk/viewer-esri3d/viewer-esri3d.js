include.module( 'viewer-esri3d', [ 'viewer', 'esri3d', 'types-esri3d', 'layer-esri3d', 'turf' ], function () {
    "use strict";

    var E = SMK.TYPE.Esri3d

    function ViewerEsri3d() {
        SMK.TYPE.Viewer.prototype.constructor.apply( this, arguments )
    }

    if ( !SMK.TYPE.Viewer ) SMK.TYPE.Viewer = {}
    SMK.TYPE.Viewer.esri3d = ViewerEsri3d

    $.extend( ViewerEsri3d.prototype, SMK.TYPE.Viewer.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerEsri3d.prototype.basemap.Topographic.esri3d = 'topo'
    ViewerEsri3d.prototype.basemap.Streets.esri3d = 'streets'
    ViewerEsri3d.prototype.basemap.Imagery.esri3d = 'satellite'
    ViewerEsri3d.prototype.basemap.Oceans.esri3d = 'oceans'
    ViewerEsri3d.prototype.basemap.NationalGeographic.esri3d = 'national-geographic'
    ViewerEsri3d.prototype.basemap.ShadedRelief.esri3d = 'terrain'
    ViewerEsri3d.prototype.basemap.DarkGray.esri3d = 'dark-gray'
    ViewerEsri3d.prototype.basemap.Gray.esri3d = 'gray'
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    ViewerEsri3d.prototype.initialize = function ( smk ) {
        var self = this

        SMK.TYPE.Viewer.prototype.initialize.apply( this, arguments )

        var el = smk.addToContainer( '<div class="smk-viewer">' )

        var layerExtras = []

        this.map = new E.Map( {
            basemap: this.basemap[ smk.viewer.baseMap ].esri3d || 'topo',
            ground: "world-elevation"
        } )

        this.view = new E.views.SceneView( {
            container: el,
            map: this.map,
            ui: new E.views.ui[ '3d' ].DefaultUI3D( {
                components: [ "attribution" ],
                padding: {
                    top: 5,
                    left: 5,
                    right: 5,
                    bottom: 5
                }
            } ),
        } )

        if ( smk.viewer.location.extent ) {
            var bx = smk.viewer.location.extent
            this.view.extent = new E.geometry.Extent( {
                xmin: bx[ 0 ],
                ymin: bx[ 1 ],
                xmax: bx[ 2 ],
                ymax: bx[ 3 ]
            } ) 
            console.log(JSON.stringify(this.view.extent),!!this.view.resizing)
        }

        if ( smk.viewer.location.zoom ) {
            this.view.zoom = smk.viewer.location.zoom
            console.log(JSON.stringify(this.view.extent),!!this.view.resizing)
        }

        if ( smk.viewer.location.center ) {
            this.view.center = new E.geometry.Point( {
                x: smk.viewer.location.center[ 0 ],
                y: smk.viewer.location.center[ 1 ]
            } ) 
        }

        // disable panning
        this.panHandler = {
            drag: this.view.on( "drag", function( evt ) {
                evt.stopPropagation()
            } ),
            keyDown: this.view.on( "key-down", function( evt ) {
                if ( /Arrow/.test( evt.key ) )
                    evt.stopPropagation()
            } )
        }

        // disable zooming
        this.zoomHandler = {
            keyDown: this.view.on( "key-down", function( evt ) {
                if ( /^([+-_=]|Shift)$/.test( evt.key ) )
                    evt.stopPropagation()
            } ),
            mouseWheel: this.view.on( "mouse-wheel", function( evt ) {
                evt.stopPropagation()
            } ),
            doubleClick1: this.view.on( "double-click", function( evt ) {
                evt.stopPropagation()
            } ),
            doubleClick2: this.view.on( "double-click", [ "Control" ], function( evt ) {
                evt.stopPropagation()
            } ),
            drag1: this.view.on( "drag", [ "Shift" ], function( evt ) {
                evt.stopPropagation()
            } ),
            drag2: this.view.on( "drag", [ "Shift", "Control" ], function( evt ) {
                evt.stopPropagation()
            } ),
        }

        // Watch view's stationary property for becoming true.
        E.core.watchUtils.whenTrue( this.view, "stationary", function() {
            self.changedView( { operation: 'move', after: 'end' } )
        } )

        E.core.watchUtils.whenFalse( this.view, "stationary", function() {
            self.changedView( { operation: 'move', after: 'start' } )
        } )

        this.changedView( {} )

        self.finishedLoading( function () {
            self.map.layers.forEach( function ( ly ) {
                if ( !ly || !ly._smk_id ) return

                if ( self.deadViewerLayer[ ly._smk_id ] ) {
                    self.map.layers.remove( ly )
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

        this.view.on( 'click', function ( ev ) {
            self.pickedLocation( {
                map:    ev.mapPoint,
                screen: { x: ev.x, y: ev.y }
            } )
        } )

        this.view.on( 'pointer-move', function ( ev ) {
            self.changedLocation( {
                map:    self.view.toMap( ev ),
                screen: { x: ev.x, y: ev.y }
            } )
        } )

        E.core.watchUtils.watch( this.view.popup, "visible", function() {
            self.changedPopup()
        } )

    }

    ViewerEsri3d.prototype.screenToGroundDistance = function ( pt1, pt2 ) {
        var ll1 = this.screenToMap( pt1 )
        if ( !ll1 ) return

        var ll2 = this.screenToMap( pt2 )
        if ( !ll2 ) return

        return turf.distance( ll1, ll2 ) * 1000
    }

    ViewerEsri3d.prototype.getView = function () {
        if ( !this.view.center ) return

        var ex = E.geometry.support.webMercatorUtils.webMercatorToGeographic( this.view.extent )

        var w = this.view.width,
            h = this.view.height

        var tl = this.screenToGroundDistance( [ 0, 0 ], [ 100, 0 ] )
        var tr = this.screenToGroundDistance( [ w, 0 ], [ w - 100, 0 ] )
        var bl = this.screenToGroundDistance( [ 0, h ], [ 100, h ] )
        var br = this.screenToGroundDistance( [ w, h ], [ w - 100, h ] )
        var c = this.screenToGroundDistance( [ w / 2 - 50, h / 2 ], [ w / 2 + 50, h / 2 ] )
        // console.log( tl, tr )
        // console.log( '       ' + c )
        // console.log( bl, br )

        var mapDist
        if ( tl && tr && bl && br && c ) {
            var t = Math.max( tr, tl ) / Math.min( tr, tl ) * 100 - 100
            var b = Math.max( br, bl ) / Math.min( br, bl ) * 100 - 100
            var l = Math.max( tl, bl ) / Math.min( tl, bl ) * 100 - 100
            var r = Math.max( tr, br ) / Math.min( tr, br ) * 100 - 100
            var tlc = Math.max( tl, c ) / Math.min( tl, c ) * 100 - 100
            var trc = Math.max( tr, c ) / Math.min( tr, c ) * 100 - 100
            var blc = Math.max( bl, c ) / Math.min( bl, c ) * 100 - 100
            var brc = Math.max( br, c ) / Math.min( br, c ) * 100 - 100

            var fudge = Math.pow( 2000 / Math.min( 2000, c ), 1.1 )
            var maxChange = Math.max( t, b, l, r, tlc, trc, blc, brc ) / fudge
            // console.log( c, maxChange, fudge )

            if ( maxChange < 6 )
                mapDist = c
        }

        var scale, metersPerPixel
        if ( mapDist )
            scale = mapDist / this.screenpixelsToMeters
            metersPerPixel = mapDist / 100

        return {
            center: this.view.center,
            zoom: this.view.zoom,
            extent: [ ex.xmin, ex.ymin, ex.xmax, ex.ymax ],
            screen: {
                width:  w,
                height: h
            },
            scale: scale,
            metersPerPixel: metersPerPixel
        }
    }

    ViewerEsri3d.prototype.screenToMap = function ( screen ) {
        var ll
        if ( Array.isArray( screen ) )
            ll = this.view.toMap( { x: screen[ 0 ], y: screen[ 1 ] } )
        else
            ll = this.view.toMap( screen )

        if ( !ll ) return
        return [ ll.longitude, ll.latitude ]
    }

    ViewerEsri3d.prototype.setBasemap = function ( basemapId ) {
        this.map.basemap = this.basemap[ basemapId ].esri3d

        this.changedBaseMap( { baseMap: basemapId } )
    }

    ViewerEsri3d.prototype.addViewerLayer = function ( viewerLayer ) {
        this.map.add( viewerLayer )
    }

    ViewerEsri3d.prototype.positionViewerLayer = function ( viewerLayer, zOrder ) {
        // console.log( viewerLayer._smk_id, zOrder )
        this.map.reorder( viewerLayer, zOrder )
    }

    // ViewerEsri3d.prototype.zoomToFeature = function ( layer, feature ) {
    //     this.map.fitBounds( feature.highlightLayer.getBounds(), {
    //         paddingTopLeft: L.point( 300, 100 ),
    //         animate: false
    //     } )
    // }

    var basemapHasLabels = {
        'ShadedRelief': true,
        'Oceans': true,
        'Gray': true,
        'DarkGray': true,
        'Imagery': true,
        'Terrain': true,
    }

    ViewerEsri3d.prototype.createBasemapLayer = function ( basemapName ) {
        return {
            features: L.esri.basemapLayer( basemapName, { detectRetina: true } ),
            labels: basemapHasLabels[ basemapName ] && L.esri.basemapLayer( basemapName + 'Labels' )
        }
    }

    ViewerEsri3d.prototype.showPopup = function ( contentEl, location, option ) {
        if ( location == null )
            location = this.popupLocation

        if ( location == null ) return

        this.popupLocation = location

        this.view.popup.actions = []
        this.view.popup.dockOptions = { buttonEnabled: false }

        this.view.popup.open( Object.assign( {
            content: contentEl,
            location: { type: 'point', latitude: location.latitude, longitude: location.longitude }
        }, option ) )
    }

    ViewerEsri3d.prototype.hidePopup = function () {
        this.view.popup.close()
    }

    ViewerEsri3d.prototype.isPopupVisible = function () {
        return this.view.popup.visible
    }

} )

