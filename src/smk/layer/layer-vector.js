include.module( 'layer.layer-vector-js', [ 'layer.layer-js' ], function () {
    "use strict";

    function VectorLayer() {
        SMK.TYPE.Layer.prototype.constructor.apply( this, arguments )
    }

    $.extend( VectorLayer.prototype, SMK.TYPE.Layer.prototype )

    SMK.TYPE.Layer[ 'vector' ] = VectorLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorLayer.prototype.getLegends = function ( viewer, width, height ) {
        var self = this

        if ( width == null ) width = 20
        if ( height == null ) height = 20

        var cv = $( '<canvas width="' + width * 3 + '" height="' + height + '">' ).get( 0 )
        var ctx = cv.getContext( '2d' )

        ctx.fillStyle = this.config.style.fillColor
        ctx.fillRect( 0, 0, width, height )

        ctx.lineWidth = 4
        ctx.strokeStyle = this.config.style.strokeColor
        ctx.strokeRect( 2, 2, width - 4 , height - 4 )

        var p = SMK.UTIL.resolved()

        if ( this.config.style.markerUrl ) {
            p = p.then( function () {
                return SMK.UTIL.makePromise( function ( res, rej ) {
                    var img = $( '<img>' )
                        .on( 'load', function () {
                            var r = img.width / img.height
                            if ( r > 1 ) r = 1 / r
                            ctx.drawImage( img, width + 5, 0, height * r, height )
                            res()
                        } )
                        .on( 'error', res )
                        .attr( 'src', viewer.resolveAttachmentUrl( self.config.style.markerUrl, null, 'png' ) )
                        .get( 0 )
                } )
            } )
        }

        return p.then( function () {
            return [ {
                url: cv.toDataURL( 'image/png' ),
            } ]
        } )
    }

    VectorLayer.prototype.initialize = function () {
        if ( this.hasChildren() )
            this.isContainer = true

        SMK.TYPE.Layer.prototype.initialize.apply( this, arguments )

        if ( this.config.useHeatmap )
            this.config.isQueryable = false
    }

    VectorLayer.prototype.hasChildren = function () {
        return ( this.config.useRaw + this.config.useClustering + this.config.useHeatmap ) > 1
    }

    VectorLayer.prototype.childLayerConfigs = function () {
        var configs = []

        if ( this.config.useClustering )
            configs.push( Object.assign( {}, this.config, {
                id: this.id + '--clustered',
                dataUrl: '@' + this.config.id,
                title: 'Clustered',
                useRaw: false,
                useHeatmap: false,
            } ) )

        if ( this.config.useHeatmap )
            configs.push( Object.assign( {}, this.config, {
                id: this.id + '--heatmap',
                dataUrl: '@' + this.config.id,
                title: 'Heatmap',
                useRaw: false,
                useClustering: false,
            } ) )

        if ( this.config.useRaw )
            configs.push( Object.assign( {}, this.config, {
                id: this.id + '--raw',
                dataUrl: '@' + this.config.id,
                title: 'Raw',
                useHeatmap: false,
                useClustering: false,
            } ) )

        return configs
    }

} )
