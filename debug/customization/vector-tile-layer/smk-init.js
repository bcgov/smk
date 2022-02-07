SMK.INIT( {
    containerSel: '#smk-map-frame',
    config: [ './smk-config.json', '?' ]
} )
.then( function ( smk ) {
    // SMK initialized

    include([
		// Load Leaflet VectorGrid
        {
            url: "https://unpkg.com/leaflet.vectorgrid@1.2.0",
            loader: "script"
        },
		// Load EU countries JSON as 'euCountries'
        {
            url: "https://leaflet.github.io/Leaflet.VectorGrid/eu-countries.js",
            loader: "script"
        }]).then(
            function() {
                const leafletMap = smk.$viewer.map;

				// Protobuf code copied and updated from:
				// https://leaflet.github.io/Leaflet.VectorGrid/demo-vectortiles.html

				// Shared tile layer styling setup

				let vectorTileStyling = {
                    water: {
                        fill: true,
                        weight: 1,
                        fillColor: '#06cccc',
                        color: '#06cccc',
                        fillOpacity: 0.2,
                        opacity: 0.4,
                    },
                    admin: {
                        weight: 1,
                        fillColor: 'pink',
                        color: 'pink',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    waterway: {
                        weight: 1,
                        fillColor: '#2375e0',
                        color: '#2375e0',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    landcover: {
                        fill: true,
                        weight: 1,
                        fillColor: '#53e033',
                        color: '#53e033',
                        fillOpacity: 0.2,
                        opacity: 0.4,
                    },
                    landuse: {
                        fill: true,
                        weight: 1,
                        fillColor: '#e5b404',
                        color: '#e5b404',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    park: {
                        fill: true,
                        weight: 1,
                        fillColor: '#84ea5b',
                        color: '#84ea5b',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    boundary: {
                        weight: 1,
                        fillColor: '#c545d3',
                        color: '#c545d3',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    aeroway: {
                        weight: 1,
                        fillColor: '#51aeb5',
                        color: '#51aeb5',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    road: {	
                        weight: 1,
                        fillColor: '#f2b648',
                        color: '#f2b648',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    transit: {
                        weight: 0.5,
                        fillColor: '#f2b648',
                        color: '#f2b648',
                        fillOpacity: 0.2,
                        opacity: 0.4,
                    },
                    building: {
                        fill: true,
                        weight: 1,
                        fillColor: '#2b2b2b',
                        color: '#2b2b2b',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    water_name: {
                        weight: 1,
                        fillColor: '#022c5b',
                        color: '#022c5b',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    transportation_name: {
                        weight: 1,
                        fillColor: '#bc6b38',
                        color: '#bc6b38',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    place: {
                        weight: 1,
                        fillColor: '#f20e93',
                        color: '#f20e93',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    housenumber: {
                        weight: 1,
                        fillColor: '#ef4c8b',
                        color: '#ef4c8b',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    poi: {
                        weight: 1,
                        fillColor: '#3bb50a',
                        color: '#3bb50a',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    },
                    earth: {
                        fill: true,
                        weight: 1,
                        fillColor: '#c0c0c0',
                        color: '#c0c0c0',
                        fillOpacity: 0.2,
                        opacity: 0.4
                    }
                };

                // Monkey-patch some properties for nextzen layer names, because
                // instead of "building" the data layer is called "buildings" and so on
                vectorTileStyling.buildings  = vectorTileStyling.building;
                vectorTileStyling.boundaries = vectorTileStyling.boundary;
                vectorTileStyling.places     = vectorTileStyling.place;
                vectorTileStyling.pois       = vectorTileStyling.poi;
                vectorTileStyling.roads      = vectorTileStyling.road;

            	// Nextzen tiles PBF layer setup

                // Assumes layers = "all", and format = "mvt"
                const nextzenTilesUrl = "https://tile.nextzen.org/tilezen/vector/v1/512/all/{z}/{x}/{y}.mvt?api_key={apikey}";

                const nextzenVectorTileOptions = {
                    rendererFactory: L.canvas.tile,
                    attribution: '<a href="https://nextzen.com/">&copy; NextZen</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
                    vectorTileLayerStyles: vectorTileStyling,
                    apikey: 'gCZXZglvRQa6sB2z7JzL1w',
                };

                let nextzenTilesPbfLayer = L.vectorGrid.protobuf(nextzenTilesUrl, nextzenVectorTileOptions);

            	// ESRI tiles PBF layer setup
                let esriStyle = {};
                esriStyle.Continent  = vectorTileStyling.earth;
                esriStyle.Bathymetry = vectorTileStyling.water;
                esriStyle["Vegetation small scale"] = vectorTileStyling.landuse;
                esriStyle["Marine area"] = vectorTileStyling.water;
                esriStyle.Land = vectorTileStyling.earth;

                esriStyle["City small scale"             ] = vectorTileStyling.building;
                esriStyle["Admin0 point"                 ] = [];
                esriStyle["Water area small scale"       ] = vectorTileStyling.water;
                esriStyle["Water line small scale/label" ] = [];
                esriStyle["Water line small scale"       ] = vectorTileStyling.water;
                esriStyle["Marine waterbody/label"       ] = [];
                esriStyle["Boundary line"                ] = vectorTileStyling.boundary;
                esriStyle["Admin0 forest or park"        ] = vectorTileStyling.landuse;
                esriStyle["Openspace or forest"          ] = vectorTileStyling.landuse;
                esriStyle["Admin1 area/label"            ] = [];
                esriStyle["Admin2 area/label"            ] = [];
                esriStyle["Admin0 forest or park/label"  ] = [];
                esriStyle["Water area small scale/label" ] = [];
                esriStyle["Road tunnel"                  ] = vectorTileStyling.road;
                esriStyle["Road"                         ] = vectorTileStyling.road;
                esriStyle["Water line medium scale/label"] = [];
                esriStyle["Water line medium scale"      ] = vectorTileStyling.water;
                esriStyle["Urban area"                   ] = vectorTileStyling.landuse;
                esriStyle["Admin1 forest or park"        ] = vectorTileStyling.landuse;
                esriStyle["Water area medium scale/label"] = [];
                esriStyle["Water area medium scale"      ] = vectorTileStyling.water;
                esriStyle["Spot elevation"               ] = [];
                esriStyle["City large scale"             ] = vectorTileStyling.building;
                esriStyle["Admin2 area/label"            ] =
                esriStyle["Water area large scale"       ] = vectorTileStyling.water;
                esriStyle["Water line large scale/label" ] = [];
                esriStyle["Water line large scale"       ] = vectorTileStyling.water;
                esriStyle["Point of interest"            ] = vectorTileStyling.building;
                esriStyle["Road/label"                   ] = [];
                esriStyle["Ferry/label"                  ] = [];
                esriStyle["Ferry"                        ] = vectorTileStyling.water;
                esriStyle["Building"                     ] = vectorTileStyling.building;
                esriStyle["Water area/label"             ] = [];
                esriStyle["Water area"                   ] = vectorTileStyling.water;
                esriStyle["Water line"                   ] = vectorTileStyling.water;
                esriStyle["Cemetery/label"               ] = [];
                esriStyle["Cemetery"                     ] = vectorTileStyling.landuse;
                esriStyle["Retail"                       ] = vectorTileStyling.landuse;
                esriStyle["Airport/label"                ] = [];
                esriStyle["Airport"                      ] = vectorTileStyling.landuse;
                esriStyle["Industry"                     ] = vectorTileStyling.landuse;
                esriStyle["Water area large scale/label" ] = [];
                esriStyle["Road tunnel/label"            ] = [];
                esriStyle["Golf course/label"            ] = [];
                esriStyle["Golf course"                  ] = vectorTileStyling.landuse;
                esriStyle["Industry/label"               ] = [];
                esriStyle["Marine area/label"            ] = [];
                esriStyle["Railroad"                     ] = vectorTileStyling.road;
                esriStyle["Medical"                      ] = vectorTileStyling.landuse;
                esriStyle["Education"                    ] = vectorTileStyling.landuse;
                esriStyle["Park or farming"              ] = vectorTileStyling.landuse;
                esriStyle["Exit"                         ] = vectorTileStyling.road;
                esriStyle["Retail/label"                 ] = [];
                esriStyle["Beach/label"                  ] = [];
                esriStyle["Beach"                        ] = vectorTileStyling.landuse;
                esriStyle["Special area of interest"     ] = vectorTileStyling.housenumber;
                esriStyle["Point of interest"            ] = vectorTileStyling.poi;
                esriStyle["Education/label"              ] = [];
                esriStyle["Landmark"                     ] = vectorTileStyling.landuse;
                esriStyle["Cemetery"                     ] = vectorTileStyling.landuse;
                esriStyle["Transportation"               ] = vectorTileStyling.road;
                esriStyle["Landmark/label"               ] = [];
                esriStyle["Medical/label"                ] = [];
                esriStyle["Park or farming/label"        ] = [];
                esriStyle["Building/label"               ] = [];

                const esriTilesUrl = "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf";

                const esriVectorTileOptions = {
                    rendererFactory: L.canvas.tile,
                    attribution: '© ESRI',
                    vectorTileLayerStyles: esriStyle,
                };

                let esriTilesPbfLayer = L.vectorGrid.protobuf(esriTilesUrl, esriVectorTileOptions);

				// Sliced GeoJSON code copied and updated from:
				// https://leaflet.github.io/Leaflet.VectorGrid/demo-geojson.html

				let euJsonLayer = L.vectorGrid.slicer( euCountries, {
				rendererFactory: L.svg.tile,
				vectorTileLayerStyles: {
					sliced: function(properties, zoom) {
						let p = properties.mapcolor7 % 5;
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

		// Set an extent that includes BC as well as Europe
		leafletMap.setView({ lat: 48, lng: -40 }, 3);

		// Add toggling of layers
		L.control.layers({}, {
			"NextZen vector tiles (Protobuf)": nextzenTilesPbfLayer,
			"ESRI basemap vector tiles (Protobuf)": esriTilesPbfLayer,
			"EU JSON (Sliced GeoJSON)": euJsonLayer
		}, {collapsed: false}).addTo(leafletMap);
	});
} )
