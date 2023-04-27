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

        const legendData = [];
        legendData.push({
            title: self.config.legend && self.config.legend.title || self.config.title,
            style: self.config.style,
            hasConditionalStyling: 'conditionalStyles' in self.config
        });

        if (self.config.conditionalStyles) {
            const defaultStyle = self.config.style ? self.config.style : {};
            self.config.conditionalStyles.forEach(conditionalStyle => {
                conditionalStyle.conditions.forEach(condition => {
                    const combinedStyle = Object.assign({}, defaultStyle);
                    Object.assign(combinedStyle, condition.style);
                    legendData.push({
                        title: condition.label || condition.value,
                        style: combinedStyle,
                        indent: true
                    });
                });
            });
            if (!self.config.legend.excludeOtherLegendWithDefaultStyling) {
                legendData.push({
                    title: self.config.legend.otherLegendLabelOverride ? self.config.legend.otherLegendLabelOverride : "Other",
                    style: self.config.style,
                    indent: true
                });
            }
        }

        return SMK.UTIL.resolved( 0 )
            .then( drawPoint )
            .then( drawLine )
            .then( drawFill )
            .then( function () {
                return legendData;
            } )

        function drawPoint( offset ) {
            if ( !self.config.legend.point ) return offset 

            if (legendData.length === 1 && legendData[0].style.markerUrl) {
                loadMarkerImage(offset)
                .then((offset) => {
                    legendData[0].url = cv.toDataURL( 'image/png' );
                    return offset;
                });
            } else {
                legendData.forEach(legendItem => {
                    const legendItemStyle = legendItem.style;
                    ctx.beginPath()
                    ctx.arc( offset + width / 2, height / 2, legendItemStyle.strokeWidth / 2, 0, 2 * Math.PI )
                    ctx.lineWidth = 2
                    ctx.strokeStyle = cssColorAsRGBA( legendItemStyle.strokeColor, legendItemStyle.strokeOpacity )
                    ctx.fillStyle = cssColorAsRGBA( legendItemStyle.fillColor, legendItemStyle.fillOpacity )
                    ctx.fill()
                    ctx.stroke()

                    legendItem.url = cv.toDataURL( 'image/png' );
                });
            }
        }

        function loadMarkerImage(offset) {
            return SMK.UTIL.makePromise( function ( res, rej ) {
                var img = $( '<img>' )
                .on( 'load', function () {
                    var r = img.width / img.height
                    if ( r > 1 ) r = 1 / r
                    ctx.drawImage( img, offset, 0, height * r, height )
                    res( offset + width )
                } )
                .on( 'error', res )
                .attr( 'src', viewer.resolveAttachmentUrl( legendData[0].style.markerUrl, null, 'png' ) )
                .get( 0 );
            });
        }

        function drawLine( offset ) {
            if ( !self.config.legend.line ) return offset 
        
            legendData.forEach( function ( legendItem ) {
                const legendItemStyle = legendItem.style;
                ctx.lineWidth = legendItemStyle.strokeWidth
                ctx.strokeStyle = cssColorAsRGBA( legendItemStyle.strokeColor, legendItemStyle.strokeOpacity )
                ctx.lineCap = legendItemStyle.strokeCap
                if ( legendItemStyle.strokeDashes ) {
                    ctx.setLineDash( legendItemStyle.strokeDashes.split( ',' ) )
                    if ( parseFloat( legendItemStyle.strokeDashOffset ) )
                        ctx.lineDashOffset = parseFloat( legendItemStyle.strokeDashOffset )
                }

                var hw = legendItemStyle.strokeWidth / 2
                ctx.moveTo( offset, height / 2 )
                ctx.quadraticCurveTo( offset + width - hw, 0, offset + width - hw, height )
                ctx.stroke()
                legendItem.url = cv.toDataURL( 'image/png' );
            } )

            return offset + width
        }

        function drawFill( offset ) {
            if ( !self.config.legend.fill ) return offset 

            legendData.forEach( function ( legendItem ) {
                const legendItemStyle = legendItem.style;
                ctx.fillStyle = cssColorAsRGBA( legendItemStyle.fillColor, legendItemStyle.fillOpacity )

                ctx.fillRect( 0, 0, width, height )
                legendItem.url = cv.toDataURL( 'image/png' );
            } )

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
        if ( !data ) return

        if ( this.loadLayer )
            return this.loadLayer( data )

        this.loadCache = data
    }

    VectorLayer.prototype.clear = function () {
        if ( this.clearLayer )
            return this.clearLayer()
    }

    var colorMemo = {}
    function cssColorAsRGBA( color, opacity ) {
        var rgb = colorMemo[ color ]
        if ( !rgb ) {
            var div = $( '<div>' ).appendTo( 'body' ).css( 'background-color', color )
            colorMemo[ color ] = rgb = window.getComputedStyle( div.get( 0 ) ).backgroundColor
            div.remove()
        }

        var s = rgb.split( /\b/ )
        if ( s.length != 8 ) throw new Error( 'can\'t parse: ' + rgb )
        return 'rgba( ' + s[ 2 ] + ',' + s[ 4 ] + ',' + s[ 6 ] + ',' + ( opacity || 1 ) + ')' 
    }
} )
