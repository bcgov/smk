include.module( 'layer.layer-vector-js', [ 'layer.layer-js' ], function () {
    "use strict";

    function VectorLayer() {
        SMK.TYPE.Layer.prototype.constructor.apply( this, arguments )
    }

    $.extend( VectorLayer.prototype, SMK.TYPE.Layer.prototype )

    SMK.TYPE.Layer[ 'vector' ] = VectorLayer
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    VectorLayer.prototype.initLegends = function ( viewer, width, height ) {
        var self = this

        if ( width == null ) width = 20
        if ( height == null ) height = 20

        var mult = ( !!this.config.legend.point + 2 * !!this.config.legend.line + !!this.config.legend.fill )

        var cv = $( '<canvas width="' + width * mult + '" height="' + height + '">' ).get( 0 )
        var ctx = cv.getContext( '2d' )

        return SMK.UTIL.resolved( 0 )
            .then( drawPoint )
            .then( drawLine )
            .then( drawFill )
            .then( function () {
                return [ {
                    url: cv.toDataURL( 'image/png' ),
                } ]
            } )

        function drawPoint( offset ) {
            if ( !self.config.legend.point ) return offset 

            return SMK.UTIL.makePromise( function ( res, rej ) {
                var img = $( '<img>' )
                    .on( 'load', function () {
                        var r = img.width / img.height
                        if ( r > 1 ) r = 1 / r
                        ctx.drawImage( img, offset, 0, height * r, height )
                        res( offset + width )
                    } )
                    .on( 'error', res )
                    .attr( 'src', viewer.resolveAttachmentUrl( self.config.style.markerUrl, null, 'png' ) )
                    .get( 0 )
            } )

        }

        function drawLine( offset ) {
            if ( !self.config.legend.line ) return offset 
        
            ctx.lineWidth = self.config.style.strokeWidth
            ctx.strokeStyle = self.config.style.strokeColor
            ctx.lineCap = self.config.style.strokeCap
            if ( self.config.style.strokeDashes )
                ctx.setLineDash( self.config.style.strokeDashes.split( ',' ) )

            ctx.moveTo( offset, height / 2 )
            ctx.lineTo( offset + 2 * width, height / 2 )
            ctx.stroke()

            return offset + 2 * width
        }

        function drawFill( offset ) {
            if ( !self.config.legend.fill ) return offset 

            var w = self.config.style.strokeWidth
            ctx.lineWidth = w
            ctx.strokeStyle = self.config.style.strokeColor
            ctx.fillStyle = self.config.style.fillColor

            ctx.fillRect( 0, 0, width, height )
            ctx.strokeRect( w / 2, w / 2, width - w , height - w )

            return offset + width
        }
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

    VectorLayer.prototype.load = function ( data ) {
        if ( this.loadLayer && data )
            return this.loadLayer( data )
    }

    VectorLayer.prototype.clear = function () {
        if ( this.clearLayer )
            return this.clearLayer()
    }
} )
