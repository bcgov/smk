SMK.INIT( {
    containerSel: '#smk-map-frame',
    config: [ './smk-config.json', '?' ]
} )
.then( function ( smk ) {
    // SMK initialized

    include([
		// Load Leaflet VectorGrid library
        {
            url: "https://unpkg.com/leaflet.vectorgrid@1.2.0",
            loader: "script"
        },
		// Load Esri tile styling as 'esriStyle'
        {
            url: "./assets/esri-tile-styling.js",
            loader: "script"
        },
        // Load EU countries GeoJSON as 'euCountries'
        {
            url: "./assets/eu-countries.js",
            loader: "script"
        }]).then(
            function() {
                const leafletMap = smk.$viewer.map;

				// Protobuf code copied and updated from:
				// https://leaflet.github.io/Leaflet.VectorGrid/demo-vectortiles.html

                const esriTilesUrl = "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf";

                const esriVectorTileOptions = {
                    rendererFactory: L.canvas.tile,
                    attribution: '© ESRI',
                    vectorTileLayerStyles: esriStyle
                };

                const esriTilesPbfLayer = L.vectorGrid.protobuf(esriTilesUrl, esriVectorTileOptions);

				// Sliced GeoJSON code copied and updated from:
				// https://leaflet.github.io/Leaflet.VectorGrid/demo-geojson.html

				const euJsonLayer = L.vectorGrid.slicer( euCountries, {
				rendererFactory: L.svg.tile,
				vectorTileLayerStyles: {
					sliced: function(properties, zoom) {
						const p = properties.mapcolor7 % 5;
						return {
							fillColor: p === 0 ? '#800026' :
								p === 1 ? '#E31A1C' :
								p === 2 ? '#FEB24C' :
								p === 3 ? '#B2FE4C' : '#FFEDA0',
							fillOpacity: 0.5,
							stroke: true,
							fill: true,
							color: 'black',
							weight: 0,
						}
					}
				},
				getFeatureId: function(f) {
					return f.properties.wb_a3;
				}
            }
		);

		// Add toggling of layers
		L.control.layers({}, {
			"ESRI basemap vector tiles (Protobuf)": esriTilesPbfLayer,
			"EU JSON (Sliced GeoJSON)": euJsonLayer
		}, {collapsed: false}).addTo(leafletMap);
	});
} )
