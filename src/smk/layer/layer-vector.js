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

        var mult = ( !!this.config.legend.point + !!this.config.legend.line + !!this.config.legend.fill )

        var cv = $( '<canvas width="' + width * mult + '" height="' + height + '">' ).get( 0 )
        var ctx = cv.getContext( '2d' )

        var styles = [].concat( self.config.style )

        return SMK.UTIL.resolved( 0 )
            .then( drawPoint )
            .then( drawLine )
            .then( drawFill )
            .then( function () {
                return [ {
                    url: cv.toDataURL( 'image/png' ),
                    title: self.config.legend.title || self.config.title
                } ]
            } )

        function drawPoint( offset ) {
            if ( !self.config.legend.point ) return offset 

            return SMK.UTIL.makePromise( function ( res, rej ) {
                if ( styles[ 0 ].markerUrl ) {
                    var img = $( '<img>' )
                        .on( 'load', function () {
                            var r = img.width / img.height
                            if ( r > 1 ) r = 1 / r
                            ctx.drawImage( img, offset, 0, height * r, height )
                            res( offset + width )
                        } )
                        .on( 'error', res )
                        .attr( 'src', viewer.resolveAttachmentUrl( styles[ 0 ].markerUrl, null, 'png' ) )
                        .get( 0 )
                }
                else {
                    ctx.beginPath()
                    ctx.arc( offset + width / 2, height / 2, styles[ 0 ].strokeWidth / 2, 0, 2 * Math.PI )
                    ctx.lineWidth = 2
                    ctx.strokeStyle = styles[ 0 ].strokeColor + alpha( styles[ 0 ].strokeOpacity )
                    ctx.fillStyle = styles[ 0 ].fillColor + alpha( styles[ 0 ].fillOpacity )
                    ctx.fill()
                    ctx.stroke()

                    res( offset + width )
                }
            } )

        }

        function drawLine( offset ) {
            if ( !self.config.legend.line ) return offset 
        
            styles.forEach( function ( st ) {
                ctx.lineWidth = st.strokeWidth
                ctx.strokeStyle = st.strokeColor
                ctx.lineCap = st.strokeCap
                if ( st.strokeDashes ) {
                    ctx.setLineDash( st.strokeDashes.split( ',' ) )
                    if ( parseFloat( st.strokeDashOffset ) )
                        ctx.lineDashOffset = parseFloat( st.strokeDashOffset )
                }

                var hw = st.strokeWidth / 2
                ctx.moveTo( offset, height / 2 )
                ctx.quadraticCurveTo( offset + width - hw, 0, offset + width - hw, height )
                ctx.stroke()
            } )

            return offset + width
        }

        function drawFill( offset ) {
            if ( !self.config.legend.fill ) return offset 

            styles.forEach( function ( st ) {
                // var w = self.config.style.strokeWidth
                // ctx.lineWidth = w
                // ctx.strokeStyle = self.config.style.strokeColor + alpha( self.config.style.strokeOpacity )
                ctx.fillStyle = rgba( st.fillColor, st.fillOpacity )

                ctx.fillRect( 0, 0, width, height )
                // ctx.strokeRect( w / 2, w / 2, width - w , height - w )
            } )

            return offset + width
        }

        function rgba( color, opacity ) {
            var div = $( '<div>' ).appendTo( 'body' ).css( 'background-color', color )
            var rgb = window.getComputedStyle( div.get( 0 ) ).backgroundColor
            div.remove()

            var m = /^.+[(]([^,]+)[,]([^,]+)[,]([^,]+).+$/.exec( rgb )
            return 'rgba( ' + m[ 1 ] + ',' + m[ 2 ] + ',' + m[ 3 ] + ',' + ( opacity || 1 ) + ')' 
        }

        function alpha( op ) {
            return Number( Math.round( ( op || 1 ) * 255 ) ).toString( 16 )
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
        if ( !data ) return

        if ( this.loadLayer )
            return this.loadLayer( data )

        this.loadCache = data
    }

    VectorLayer.prototype.clear = function () {
        if ( this.clearLayer )
            return this.clearLayer()
    }
} )
