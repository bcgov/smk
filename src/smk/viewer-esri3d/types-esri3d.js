include.module( 'types-esri3d', [ 'esri3d' ], function () {
    "use strict";

    return new Promise( function ( res ) {
        var objs = [
            'esri/config',
            'esri/request',

            // base
            'esri/Map',
            'esri/views/SceneView',
            // 'esri/views/ui/DefaultUI',
            'esri/views/ui/3d/DefaultUI3D',
            'esri/views/ui/UI',
            'esri/core/watchUtils',

            // widgets
            'esri/widgets/NavigationToggle',
            'esri/widgets/Compass',
            'esri/widgets/Zoom',
            // 'esri/widgets/Expand',
            // 'esri/widgets/BasemapGallery',
            // 'esri/widgets/Legend',
            // 'esri/widgets/Home',
            // 'esri/widgets/LayerList',
            // 'esri/widgets/Search',
            "esri/widgets/DirectLineMeasurement3D",
            "esri/widgets/AreaMeasurement3D",

            // layers
            'esri/layers/MapImageLayer',
            'esri/layers/WMSLayer',
            'esri/layers/BaseDynamicLayer',
            // 'esri/layers/FeatureLayer',
            'esri/layers/GraphicsLayer',

            // rendering
            // 'esri/renderers/SimpleRenderer',
            // 'esri/renderers/UniqueValueRenderer',
            // 'esri/renderers/ClassBreaksRenderer',

            // symbols
            'esri/Graphic',
            'esri/Color',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'esri/symbols/SimpleFillSymbol',

            // geometry
            'esri/geometry/Point',
            'esri/geometry/Polyline',
            'esri/geometry/Polygon',
            'esri/geometry/Extent',
            'esri/geometry/SpatialReference',
            'esri/geometry/geometryEngine',
            'esri/geometry/support/webMercatorUtils'

            // dojo stuff
            // 'dojo/domReady!'
        ]

        SMK.TYPE.Esri3d = {}

        require( objs, function () {
            var args = [].slice.call( arguments )

            objs.forEach( function ( o, i ) {
                var parts = o.replace( 'esri/', '' ).split( '/' )
                var container = SMK.TYPE.Esri3d

                for( var j = 0; j < parts.length - 1; j += 1 ) {
                    if ( !( parts[ j ] in container ) )
                        container[ parts[ j ] ] = {}
                    container = container[ parts[ j ] ]
                }

                container[ parts[ parts.length - 1 ] ] = args[ i ]
            } )

            res( SMK.TYPE.Esri3d )
        } )
    } )
} )