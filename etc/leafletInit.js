var getQueryString = function ( field, url ) 
{
	var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};
// init the map
var mainMap = L.map('map');

// start the map with a centre point and a zoom level
// leaflet uses latlong (x, y) which is annoying. would be nicer in longLat
// check query string for default lat and lon
var lat = parseFloat(getQueryString('lat'));
var lon = parseFloat(getQueryString('lon'));
var zoom = parseInt(getQueryString('zoom'));
var fullscreen = getQueryString('fs') == "true" ? true : false

// set bounds to BC only
var southWest = L.latLng(47.294133725, -113.291015625),
	northEast = L.latLng(61.1326289908, -141.064453125),
	bounds = L.latLngBounds(southWest, northEast);
mainMap.fitBounds(bounds);
//mainMap.setMaxBounds(bounds);

mainMap.on('click', function (e) 
{
	clearResults()
});

// if user supplied lat lon values, zoom to it
if(lat != null && lon != null && !isNaN(lat) && !isNaN(lon))
{
	try 
	{
		if(isNaN(zoom)) 
		{ 
			zoom = 10; 
		}
        mainMap.setView(new L.latLng(lat, lon), zoom);
	} 
	catch(err) 
	{
    }
}

if(fullscreen) 
{
	var elem = document.getElementById("map");
    if (elem.requestFullscreen) 
    {
    	elem.requestFullscreen();
    }
}
// initialize minimap
var mmLyr = L.esri.basemapLayer("Topographic", 
{
    detectRetina: true
});

var miniMap = new L.Control.MiniMap(mmLyr, { toggleDisplay: true }).addTo(mainMap);

// initialize the scalebar
L.control.betterscale({imperial: false, metric: true}).addTo(mainMap);
// initialize scale factor
L.control.scalefactor().addTo(mainMap);
// initialize history control
//new L.HistoryControl(
//{
//	position: 'topleft', 
//	orientation: 'vertical'
//}).addTo(mainMap);
// initialize coord control
L.control.coordinates({
	position:"bottomleft",
	decimals:4, 
	labelTemplateLat:"Lat: {y}",
	labelTemplateLng:"Long: {x}",
	useDMS:false,
	useLatLngOrder: false
}).addTo(mainMap);
// initialize the sidebar
var sidebar = L.control.sidebar('sidebar').addTo(mainMap);

/** containers **/
var currentBasemap;
var layerLabels;
var allLayers = [];
var layerTitles = [];
var layerMetadata = [];
var identifyResults = [];
var basemapButtons = [];
var selectedFeatures = [];

var queryingMpcm = false;
var queryingWms = false;
var queryingFeatureService = false;

/** functions **/
function initMeasureTools()
{
	var options = 
	{
	    position: 'topleft',
	    primaryLengthUnit: 'meters', 
	    secondaryLengthUnit: 'kilometers',
	    primaryAreaUnit: 'hectares', 
	    secondaryAreaUnit: 'sqmeters',
	    activeColor: '#38598a',
	    completedColor: '#036'
	};
	
	var measureControl = L.control.measure(options);
	measureControl.addTo(mainMap);
}

function initMarkupTools()
{
	// initialize PM draw markup
	var options = 
	{
	    position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
	    drawMarker: true,  // adds button to draw markers
	    drawPolygon: true,  // adds button to draw a polygon
	    drawPolyline: true,  // adds button to draw a polyline
	    drawCircle: true,  // adds button to draw a cricle
	    editPolygon: true,  // adds button to toggle global edit mode
	    deleteLayer: true   // adds a button to delete layers
	};

	// add leaflet.pm controls to the map
	mainMap.pm.addControls(options);
}

function initBasemapButton(name)
{
	var bmButtonMap = L.map(name + "Basemap", 
	{
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        keyboard: false,
        scrollWheelZoom: false,
        center: mainMap.getCenter(),
        zoom: 10
    });
	
	basemapButtons.push(bmButtonMap);
	
	buttonLyr = L.esri.basemapLayer(name, 
	{
	    detectRetina: true
	});

	bmButtonMap.addLayer(buttonLyr);
	
	mainMap.on('zoomend', function () 
	{
        bmButtonMap.setView(mainMap.getCenter(), mainMap.getZoom());
        bmButtonMap.invalidateSize();
    }, this);

    mainMap.on('moveend', function () 
    {
    	bmButtonMap.setView(mainMap.getCenter(), mainMap.getZoom());
    	bmButtonMap.invalidateSize();
    }, this);
    
    bmButtonMap.invalidateSize();
}

function refreshBasemapButtons()
{
	for(i = 0; i < basemapButtons.length; i++)
	{
		basemapButtons[i].invalidateSize();
	}
}

function setBasemap(name)
{
	if(currentBasemap)
	{
		mainMap.removeLayer(currentBasemap);
	}

	currentBasemap = L.esri.basemapLayer(name, 
	{
	    detectRetina: true
	});

	mainMap.addLayer(currentBasemap);
	currentBasemap.bringToBack();
	
    if (layerLabels) 
    {
    	mainMap.removeLayer(layerLabels);
    }

    if (name === 'ShadedRelief'
     || name === 'Oceans'
     || name === 'Gray'
     || name === 'DarkGray'
     || name === 'Imagery'
     || name === 'Terrain'
    ) 
    {
    	layerLabels = L.esri.basemapLayer(name + 'Labels');
    	mainMap.addLayer(layerLabels);
    }
}

function addEsriFeatureLayer(id, url, layerId, title, opacity, visible)
{
    var layer = L.esri.featureLayer(
    {
        url: url + "/" + layerId,
        opacity: opacity
    });
    
    if(visible) mainMap.addLayer(layer);
    
    //layer.setZIndex(id);
    allLayers[id] = layer;
    
 // create layer section in layer div
    addToLayerList(title, id, visible);
    
    // add to legend


    
    // identify
}

function addEsriDynamicLayer(id, url, title, layers, opacity, dynamicLayers, metadataUrl, visible)
{
    var layer = L.esri.dynamicMapLayer(
    {
        url: url,
        opacity: opacity,
        layers: layers,
        dynamicLayers: dynamicLayers
    });
    
    if(visible) mainMap.addLayer(layer);
    
    allLayers[id] = layer;
    layerTitles[id] = title;
    layerMetadata[id] = metadataUrl;
    
    // create layer section in layer div
    $("#layerList").append("<div class='row' style='margin-top: 5px;'><div class='col s7'><a href='" + metadataUrl + "' target='_blank'>" + title + "</a></div><div class='col s5'><div class='switch'><label>Off<input type='checkbox' id='layerToggle" + id + "' onclick='toggleLayerVisibility(" + id + ")' " + (visible ? "checked" : "") +"><span class='lever'></span>On</label></div></div></div>");
    $("#layerList").change();
    
    $("#layerToggle" + id).checked = visible; 
    $("#layerToggle" + id).change();
    
    // add to legend panel
  	var legendCall = "http://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer/legend?f=pjson";
    legendCall += "&dynamicLayers=" + JSON.stringify(layer.getDynamicLayers());
    $.ajax(
    {
        url: legendCall,
        type: "get",
        dataType: "jsonp",
        contentType: "application/json",
        crossDomain: true,
        withCredentials: true,
        success: function (data) 
        {
        	// parse out image, paste in legend panel
        	var layer = data.layers[0]; // should only get one back...
        	$("#legendPanel").append("<div class='row' style='margin: 0 0 6px 0; font-size: 14px; font-weight: 600; padding-top: 5px; padding-bottom: 5px; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'><div class='col s12'>" + title + "</div></div>");
        	
        	layer.legend.forEach(function(obj) 
        	{        		
        		$("#legendPanel").append("<div class='row' style='margin: 0px; padding-left: 0px;'><div class='col s2'><img src='data:image/png;base64," + obj.imageData + "'></div><div class='col s10' style='font-size: 12px; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'>" + obj.label + "</div></div>");
        	});
        	
        	$("#legendPanel").change();
        },
        error: function (status) 
        {
        	alert(JSON.stringify(status));
        }
    });
    
    // identify
    mainMap.on('click', function (e) 
    {
    	if(mainMap.hasLayer(layer))
    	{
    		$("#querySpinner").attr("class", "preloader-wrapper big active");
    		
	        // call the identify service
	        // url: http://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer/identify?
	        // geometryType=esriGeometryPoint
	        // geometry=long %2C lat (convert to albers)
	        // sr=3005
	        // layerDefs= 
	        // time=
	        // layerTimeOptions=
	        // tolerance=1
	        // mapExtent=386319.69312169263%2C844584.397707231%2C1761163.3068783064%2C2569388.2040564376 (bc bounding box in albers)
	        // imageDisplay=600%2C550%2C96
	        // returnGeometry=true
	        // maxAllowableOffset=
	        // geometryPrecision=
	        // dynamicLayers={dynamic layer from layer obj}
	        // returnZ=false
	        // returnM=false
	        // gdbVersion=
	        // f=pjson

            var bbox = mainMap.getBounds().toBBoxString();
            
            var points = bbox.split(",");
            var c1 = projectPointAlberts([points[0], points[1]]);
            var c2 = projectPointAlberts([points[2], points[3]]);
            
            bbox = c1[0] + "," + c1[1] + "," + c2[0] + "," + c2[1];

	        var identifyCall = "http://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer/identify?";
	        identifyCall += "geometryType=esriGeometryPoint&sr=3005&tolerance=1&mapExtent=" + bbox + "&imageDisplay=600%2C550%2C96&returnGeometry=true&returnZ=false&returnM=false&f=pjson";
	        
	        // get the lat lon as albers
	        var sourceProj = new proj4("WGS84");
	        var destProj = new proj4("EPSG:3005");
	        var projectedCoord = proj4(sourceProj, destProj, [e.latlng.lng, e.latlng.lat]);
	        var x = projectedCoord[0];
	        var y = projectedCoord[1];
	        
	        identifyCall += "&geometry=" + x + "%2C" + y;
	        identifyCall += "&dynamicLayers=" + JSON.stringify(layer.getDynamicLayers());
	        
	        queryingMpcm = true;
	        
	        $.ajax(
	        {
	            url: identifyCall,
	            type: "get",
	            dataType: "jsonp",
	            contentType: "application/json",
	            crossDomain: true,
	            withCredentials: true,
	            success: function (data) 
	            {
	            	// loop through results, add data to query results table
	            	var results = data.results;
	            	
	            	if(results.length > 0)
	            	{
	            		// make sure identify results are open
	            		
	            		var queryResultsClass = $('#queryAnchorLi').attr('class');
	            		if(queryResultsClass != "active")
	            		{
	            			$('#queryResultAnchor')[0].click();
	            		}
	            		
		            	$("#queryResults").append("<div class='row' style='margin: 0px;'><div class='col s12' style='padding: 0px;'><div class='card white'><div class='card-content black-text'><span style='font-size: 16px;'>" + layerTitles[id] + "</span><div id='resultData" + id + "' /></div><div class='card-action'><a href='" + layerMetadata[id] + "' target='_blank'>Metadata</a></div></div></div></div>");
		            	$("#queryResults").change();
	
		            	//resultData + id
		            	var index = 0;
		            	results.forEach(function(obj) 
		            	{ 
		            		// for each result, add the value as a header
		            		var name = obj.value;
		            		if(name.length == 0) name = "Unknown";
	
		            		var identifyResult = 
	            			{
	            				id: "result" + id + "" + index,
	            				label: name,
	            				geometryType: obj.geometryType,
	            				geometry: obj.geometry,
	            				attributes: null,
	            				projected: false
	            			}
		            		
		            		identifyResults.push(identifyResult);
		            		
		            		$("#resultData" + id).append("<p style='font-size: 14px;'><a href='#' onclick='zoomToIdentifiedGeometry(\"" + identifyResult.id + "\")'>" + name + "</a></p>");
		            		
		            		var divName = "result" + id + "" + index;
		            		buildDynamicIdentifyResults([{name: 'layerId', value: obj.layerId},{name: 'div', value: divName},{name: 'attr', value: JSON.stringify(obj.attributes)}]);
		            		
		            		index++;

		            		$("#resultData" + id).change();
		            		
		            		if(index == results.length)
	            			{
		            			queryingMpcm = false;
				            	
				            	if(queryingMpcm == false && queryingWms == false)
			            		{
				            		$("#querySpinner").attr("class", "preloader-wrapper big");
			            		}
	            			}
		            	});
		            	
		            	Materialize.toast("Located " + results.length + " records from the '" + title + "' layer.", 4000);
	            	}
	            	else
            		{
	            		queryingMpcm = false;
		            	if(queryingMpcm == false && queryingWms == false)
	            		{
		            		$("#querySpinner").attr("class", "preloader-wrapper big");
	            		}
            		}
	            },
	            error: function (status) 
	            {
	                // error handler
	            }
	        });
    	}
    });
}

function bindIdentifyAttributeList(id, attr)
{
	// attach attributes to identifyResult by the div id
	identifyResults.forEach(function(obj)
	{
		if(obj.id == id)
		{
			obj.attributes = attr;
		}
	});
}

function addWmsLayer(id, serviceUrl, version, style, layers, attribution, opacity, title, visible)
{
    var layer = L.tileLayer.wms(serviceUrl, 
    {
        layers: layers,
        styles: style,
        version: version,
        format: 'image/png',
        transparent: true,
        attribution: attribution
    });
    
    layer.setOpacity(opacity);
    //layer.setZIndex(id);
    
    if(visible) mainMap.addLayer(layer);
    
    allLayers[id] = layer;
    
    // add legend
	$("#legendPanel").append("<div class='row' style='margin: 0 0 6px 0; font-size: 14px; font-weight: 600; padding-top: 5px; padding-bottom: 5px; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'><div class='col s12'>" + title + "</div></div>");
	$("#legendPanel").append("<div class='row' style='margin: 0px; padding-left: 0px;'><div class='col s12'><img src='" + serviceUrl + "?SERVICE=WMS&VERSION=" + version + "&layer=" + layers + "&style=" + style + "&REQUEST=getlegendgraphic&FORMAT=image/png'></div></div>");
	
	$("#legendPanel").change();
	
    // create layer section in layer div
	addToLayerList(title, id, visible);
    
    // identify query
    mainMap.on('click', function (e) 
    {
    	if(mainMap.hasLayer(layer))
    	{
    		$("#querySpinner").attr("class", "preloader-wrapper big active");
    		
	    	var x = mainMap.layerPointToContainerPoint(e.layerPoint).x;
	    	var y = mainMap.layerPointToContainerPoint(e.layerPoint).y;
	    	var width = mainMap.getSize().x;
	    	var height = mainMap.getSize().y;

	    	var unit = 'meters';
            var buffered = turf.buffer({type: "Point", coordinates: [e.latlng.lng, e.latlng.lat]}, 10, "meters");
            
            var buffLayer = L.geoJSON(buffered);
            
            var bounds = buffLayer.getBounds();
            var bbox = buffLayer.getBounds().toBBoxString();
            
            var points = bbox.split(",");
            var c1 = projectPointMercator([points[0], points[1]]);
            var c2 = projectPointMercator([points[2], points[3]]);
            
            bbox = c1[0] + "," + c1[1] + "," + c2[0] + "," + c2[1];
            
	    	var identifyCall = serviceUrl + "?service=WMS&version=" + version + "&request=GetFeatureInfo&bbox=" + bbox + "&feature_count=10&width=" + width + "&height=" + height + "&format=image%2Fpng&info_format=application%2Fjson&layers=" + layers + "&query_layers=" + layers + "&buffer=10&srs=EPSG%3A3857&x=" + x + "&y=" + y;
	    			
	    	queryingWms = true;
	    	
	    	$.ajax(
	        {
	            url: identifyCall,
	            type: "get",
	            dataType: "json",
	            contentType: "application/json",
	            crossDomain: true,
	            withCredentials: true,
	            success: function (data) 
	            {
	            	var results = data.features;

	            	if(results.length > 0)
	            	{
	            		// make sure identify results are open
	            		
	            		var queryResultsClass = $('#queryAnchorLi').attr('class');
	            		if(queryResultsClass != "active")
	            		{
	            			$('#queryResultAnchor')[0].click();
	            		}
	            		
		            	$("#queryResults").append("<div class='row' style='margin: 0px;'><div class='col s12' style='padding: 0px;'><div class='card white'><div class='card-content black-text'><span style='font-size: 16px;'>" + title + "</span><div id='resultData" + id + "' /></div></div></div></div>");
		            	$("#queryResults").change();
	
		            	//resultData + id
		            	var index = 0;
		            	results.forEach(function(obj) 
		            	{ 
		            		// for each result, add the value as a header
		            		var idStrings = obj.id.split(".");
		            		var name = idStrings[idStrings.length - 1];
		            		if(name.length == 0) name = "Unknown";
	
		            		var identifyResult = 
	            			{
	            				id: "result" + id + "" + index,
	            				label: name,
	            				geometryType: obj.geometryType,
	            				geometry: obj.geometry,
	            				attributes: obj.properties,
	            				projected: false
	            			}
		            		
		            		identifyResults.push(identifyResult);
		            		
		            		$("#resultData" + id).append("<p style='font-size: 14px;'><a href='#' onclick='zoomToIdentifiedGeometry(\"" + identifyResult.id + "\")'>" + name + "</a></p>");
		            		
		            		index++;

		            		$("#resultData" + id).change();
		            		
		            		if(index == results.length)
	            			{
		            			queryingWms = false;
				            	
				            	if(queryingMpcm == false && queryingWms == false)
			            		{
				            		$("#querySpinner").attr("class", "preloader-wrapper big");
			            		}
	            			}
		            	});
		            	
		            	Materialize.toast("Located " + results.length + " records from the '" + title + "' layer.", 4000);
	            	}
	            	else
            		{
	            		queryingWms = false;
		            	if(queryingMpcm == false && queryingWms == false)
	            		{
		            		$("#querySpinner").attr("class", "preloader-wrapper big");
	            		}
            		}
	            },
		        error: function (status) 
		        {
		            alert(JSON.stringify(status));
		        }
	        });
    	}
    });
}

function addKmlLayer(id, docId, attachmentId, cluster, heatmap, visible, style)
{
	var customLayer = L.geoJson(null, {
	    style: style
	});
	
	var kmlToJsonLayer = omnivore.kml("./document.xhtml?docid=" + docId + "&attid=" + attachmentId + "&type=xml", null, customLayer);
	
	kmlToJsonLayer.on('ready', function() 
	{
		kmlToJsonLayer.eachLayer(function(layer) 
		{
			if(layer.feature.properties.name == null) layer.bindPopup(layer.feature.properties.description, {
	            maxWidth : 600
	        });
			else layer.bindPopup(layer.feature.properties.name, {
	            maxWidth : 600
	        });
	    });
		
		if(cluster)
		{
			var markers = L.markerClusterGroup();
			markers.addLayer(kmlToJsonLayer);
			// add cluster layer to legend and layer selection
			
			addToLayerList(attachmentId, id, visible);
		    
		    if(visible) mainMap.addLayer(markers);
		    allLayers[id] = markers;
		}
		else 
		{
			addToLayerList(attachmentId, id, visible);
		    
		    if(visible) mainMap.addLayer(kmlToJsonLayer);
		    allLayers[id] = kmlToJsonLayer;
		}
		
		if(heatmap)
		{
			var points = [];
			var intensity = 100;
			
			kmlToJsonLayer.eachLayer(function (layer) 
			{
				var centroid = turf.centroid(layer.feature.geometry);
				points.push([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0], intensity]);
			});
			
			var heat = L.heatLayer(points, {radius: 25});
			
			addToLayerList(attachmentId + " Heatmap", "999999" + id, false);
		    
		    allLayers["999999" + id] = heat;
		}
	});
	
	kmlToJsonLayer.on('error', function() 
	{
        alert("Error loading KML document...");
    });
	
	// add to legend?
}

function addJsonLayer(id, docId, attachmentId, cluster, heatmap, visible, style)
{
	var layer = new L.geoJson(null, {
	    style: style
	});

	$.ajax(
	{
		dataType: "json",
		url: "./document.xhtml?docid=" + docId + "&attid=" + attachmentId + "&type=json",
		success: function(data) 
		{
			data.features.forEach(function(obj)
			{
				layer.addData(data);
			});
			
			if(cluster)
			{
				var markers = L.markerClusterGroup();
				markers.addLayer(layer);
				// add cluster layer to legend and layer selection
				
				addToLayerList(attachmentId, id, visible);
			    
			    if(visible) mainMap.addLayer(markers);
			    allLayers[id] = markers;
			}
			else 
			{
				addToLayerList(attachmentId, id, visible);
			    
			    if(visible) mainMap.addLayer(layer);
			    allLayers[id] = layer;
			}
			
			if(heatmap)
			{
				var points = [];
				var intensity = 100;
				
				layer.eachLayer(function (layer) 
				{
					var centroid = turf.centroid(layer.feature.geometry);
					points.push([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0], intensity]);
				});
				
				var heat = L.heatLayer(points, {radius: 25});
				
				addToLayerList(attachmentId + " Heatmap", "999999" + id, false);
			    
			    allLayers["999999" + id] = heat;
			}
	    },
		error: function(status)
		{
			alert(JSON.stringify(status));
		}
	});
}

function addToLayerList(title, id, visible)
{
	$("#layerList").append("<div class='row' style='margin-top: 5px;'><div class='col s7'>" + title + "</div><div class='col s5'><div class='switch'><label>Off<input id='layerToggle" + id + "' type='checkbox' onclick='toggleLayerVisibility(" + id + ")' " + (visible ? "checked" : "") +"><span class='lever'></span>On</label></div></div></div>");    
    $("#layerList").change();
    $("#layerToggle" + id).checked = visible; 
    $("#layerToggle" + id).change();
}

function toggleLayerVisibility(id)
{
	var layer = allLayers[id];

    if(mainMap.hasLayer(layer)) mainMap.removeLayer(layer);
    else layer.addTo(mainMap);
}

//default AOI styles
var aoiStyle = 
{
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.45
};

var identifiedLayer;
function zoomToIdentifiedGeometry(id)
{
	identifyResults.forEach(function(obj)
	{
		if(obj.id == id)
		{
			// get coordinates
			// project from 3005 to wgs84
			// get centroid, bbox
			// zoom to bbox, create popup at centroid with attributes
			var geojson = obj.geometry;
			var isWms = obj.geometryType == null;
			
			if(obj.projected == false)
			{
				if(obj.geometryType == null)
				{
					geojson = obj.geometry;
				}
				else geojson = Terraformer.ArcGIS.parse(obj.geometry);
				
				if(geojson.type == "Point")
				{
					var projectedCoords = projectPoint(geojson.coordinates);
					geojson.coordinates = projectedCoords;
				}
				else if(geojson.type == "MultiPoint" || geojson.type == "LineString")
				{
					for(i = 0; i < geojson.coordinates.length; i++)
					{
						var coords = geojson.coordinates[i];
						var projectedCoords = projectPoint(coords);
						geojson.coordinates[i] = projectedCoords;
					}
				}
				else if(geojson.type == "MultiLineString" || geojson.type == "Polygon")
				{
					for(i = 0; i < geojson.coordinates.length; i++)
					{
						var linestring = geojson.coordinates[i];
						for(j = 0; j < linestring.length; j++)
						{
							var coords = linestring[j];
							var projectedCoords = projectPoint(coords);
							geojson.coordinates[i][j] = projectedCoords;
						}
					}
				}
				else if(geojson.type == "MultiPolygon")
				{
					for(i = 0; i < geojson.coordinates.length; i++)
					{
						var poly = geojson.coordinates[i];
						for(j = 0; j < poly.length; j++)
						{
							var interior = poly[j];
							for(p = 0; p < interior.length; p++)
							{
								var coords = interior[p];
								var projectedCoords = projectPoint(coords);
								geojson.coordinates[i][j][p] = projectedCoords;
							}
						}
					}
				}
			}
			
			obj.projected = true;
			obj.geometry = geojson;
			
	        if(identifiedLayer)
        	{
	        	mainMap.removeLayer(identifiedLayer);
        	}
	        
	        var aoiCentre = turf.centroid(geojson);
	        
	        identifiedLayer = L.geoJSON(geojson, 
	        {
                style: aoiStyle
            }).addTo(mainMap);
	        
	        //identifiedLayer.on('click', function(e) 
	        //{ 
	        //	mainMap.removeLayer(identifiedLayer);
	        //});
	        
	        var popupContent = "<div class='row' style='margin: none; border-bottom: 1px solid lightgrey;'><h5>" + obj.label + "</h5></div><div id='popupContent" + id + "' style='max-height: 200px;overflow: auto;'>";
	        var rowIndex = 0;
	        for (var key in obj.attributes) 
	        {
	        	if (obj.attributes.hasOwnProperty(key)) 
	        	{
	        		var val = obj.attributes[key];
	        		//if(val != null && isWms == false) val = val.substring(1, val.length-1).trim(); // trim out the "" and any whitespace
	        		
	        		if(val != null && val != "Null" && key != "Geometry" && key != "GEOMETRY" && key != "SHAPE" && key != "Shape" && key != "OBJECTID" && key != "Objectid")
        			{
	        			var keyVal = key.toString()//.replace(new RegExp('_', 'g'), key.toString()).trim();
	        			
	        			// is val a url?
	        			if(val.toString().startsWith("http"))
	        			{
	        				val = "<a href='" + val + "' target='_blank'>Link</a>";
	        			}
	        			
		        		if(rowIndex % 2 == 0)
	        			{
		        			popupContent += "<div class='row' style='margin: 0px; margin-bottom: 5px; background: #f2f2f2; border-radius: 2px;'>";
	        			}
		        		else
		        		{
		        			popupContent += "<div class='row' style='margin: 0px; margin-bottom: 5px;'>";
		        		}
		        		
		        		popupContent += "<div class='col s4'><span style='word-wrap: break-word; margin: 0 0 6px 0; font-size: 14px; font-weight: 600; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'>" + keyVal + "</span></div><div class='col s8'><span style='word-wrap: break-word; word-wrap: break-word; margin: 0 0 6px 0; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'>" + val + "</span></div></div>";
		        		
		        		rowIndex++;
        			}
	        	}
	        }
	        popupContent +="</div>"; // close data panel
	        
	        // add bottom options panel
	        popupContent +="<div style='border-top: 1px solid lightgrey; margin-top: 10px;'><a href='#' onclick='zoomToIdentifiedGeometry(\"" + id + "\")'>Zoom To</a><a href='' style='margin-left: 15px;'>Directions</a><a href='#' onclick='selectFeature(\"" + id + "\")' style='margin-left: 15px;'>Add to selection</a></div>";
	        
	        identifiedLayer.bindPopup(popupContent, {
	            maxWidth : 600
	        });
	        identifiedLayer.openPopup();
	        
	        if(geojson.type == "Point")
        	{
	        	// dont want to zoom right in, so tone it down for a point
	        	mainMap.setView([geojson.coordinates[1], geojson.coordinates[0]], 15);
        	}
	        else mainMap.fitBounds(identifiedLayer.getBounds());
	        
	        //var coords = aoiCentre.geometry.coordinates;
	        //mainMap.setView([coords[1], coords[0]], zoom);
		}
	});
}

var selectedStyle = 
{
    radius: 8,
    fillColor: "#38598a",
    color: "#036",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.45
};

var selectedLayer;
function zoomToSelectedGeometry(id)
{
	selectedFeatures.forEach(function(obj)
	{
		if(obj.id == id)
		{
			var geojson = obj.geometry;
			var isWms = obj.geometryType == null;
			
	        if(selectedLayer)
        	{
	        	mainMap.removeLayer(selectedLayer);
        	}
	        
	        var aoiCentre = turf.centroid(geojson);
	        
	        selectedLayer = L.geoJSON(geojson, 
	        {
                style: selectedStyle
            }).addTo(mainMap);
	        
	        var popupContent = "<div class='row' style='margin: none; border-bottom: 1px solid lightgrey;'><h5>" + obj.label + "</h5></div><div id='popupContent" + id + "' style='max-height: 200px;overflow: auto;'>";
	        var rowIndex = 0;
	        for (var key in obj.attributes) 
	        {
	        	if (obj.attributes.hasOwnProperty(key)) 
	        	{
	        		var val = obj.attributes[key];
	        		//if(val != null && isWms == false) val = val.substring(1, val.length-1).trim(); // trim out the "" and any whitespace
	        		
	        		if(val != null && val != "Null" && key != "Geometry" && key != "GEOMETRY" && key != "SHAPE" && key != "Shape" && key != "OBJECTID" && key != "Objectid")
        			{
	        			var keyVal = key.toString()//.replace(new RegExp('_', 'g'), key.toString()).trim();
	        			
	        			// is val a url?
	        			if(val.toString().startsWith("http"))
	        			{
	        				val = "<a href='" + val + "' target='_blank'>Link</a>";
	        			}
	        			
		        		if(rowIndex % 2 == 0)
	        			{
		        			popupContent += "<div class='row' style='margin: 0px; background: #f2f2f2; border-radius: 2px;'>";
	        			}
		        		else
		        		{
		        			popupContent += "<div class='row' style='margin: 0px;'>";
		        		}
		        		
		        		popupContent += "<div class='col s4' style='border-right: 1px solid #c4c4c4;'><span style='word-wrap: break-word; margin: 0 0 6px 0; font-size: 14px; font-weight: 600; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'>" + keyVal + "</span></div><div class='col s8'><span style='word-wrap: break-word; word-wrap: break-word; margin: 0 0 6px 0; font-family: \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;'>" + val + "</span></div></div>";
		        		
		        		rowIndex++;
        			}
	        	}
	        }
	        popupContent +="</div>"; // close data panel
	        
	        // add bottom options panel
	        popupContent +="<div style='border-top: 1px solid lightgrey; margin-top: 10px;'><a href='#' onclick='zoomToSelectedGeometry(\"" + id + "\")'>Zoom To</a><a href='' style='margin-left: 15px;'>Directions</a></div>";
	        
	        selectedLayer.bindPopup(popupContent, {
	            maxWidth : 600
	        });
	        selectedLayer.openPopup();
	        
	        if(geojson.type == "Point")
        	{
	        	// dont want to zoom right in, so tone it down for a point
	        	mainMap.setView([geojson.coordinates[1], geojson.coordinates[0]], 15);
        	}
	        else mainMap.fitBounds(selectedLayer.getBounds());
		}
	});
}

function clearResults()
{
	var pane = document.getElementById('queryResults');
    pane.innerHTML = "";
    identifyResults = [];
}

function clearHighlights()
{
	if(identifiedLayer) mainMap.removeLayer(identifiedLayer);
	if(selectedLayer) mainMap.removeLayer(selectedLayer);
}

function projectPointAlberts(point)
{
	var sourceProj = new proj4("WGS84");
    var destProj = new proj4("EPSG:3005");
    var projectedCoords = proj4(sourceProj, destProj, point);
    
    return projectedCoords;
}

function projectPoint(point)
{
	var sourceProj = new proj4("EPSG:3005");
    var destProj = new proj4("WGS84");
    var projectedCoords = proj4(sourceProj, destProj, point);
    
    return projectedCoords;
}

function projectPointMercator(point)
{
	var sourceProj = new proj4("WGS84");
    var destProj = new proj4("EPSG:3857");
    var projectedCoords = proj4(sourceProj, destProj, point);
    
    return projectedCoords;
}

function selectFeature(id)
{
	identifyResults.forEach(function(obj)
	{
		if(obj.id == id)
		{
			// could check for duplicates here? 
			
			selectedFeatures.push(obj);
			index = selectedFeatures.indexOf(obj);
			// display in selection panel
			$("#selectedResults").append("<div id='select" + index + "' class='row' style='margin: 0px;'><div class='col s12' style='padding: 0px;'><div class='card white'><div class='card-content black-text'><div class='row' style='margin: 0px;'><div class='col s9' style='padding: 0px;'><span style='font-size: 16px;'><a href='#' onclick='zoomToSelectedGeometry(\"" + id + "\")'>" + obj.label + "</a></span></div><div class='col s3' style='padding: 0px;'><a href='#' onclick='removeSelection(\"" + id + "\")' style='margin-left: 10px;'><i class='material-icons'>delete_forever</i></a></div></div></div></div></div>");        	
			$("#selectedResults").change();
			
			Materialize.toast(obj.label + " added to selection set!", 4000);
		}
	});
}

function removeSelection(id)
{
	selectedFeatures.forEach(function(obj)
	{
		if(obj.id == id)
		{
			index = selectedFeatures.indexOf(obj);
			$("#select" + index).remove();
		}
	});
}

function clearSelections()
{
	var pane = document.getElementById('selectedResults');
    pane.innerHTML = "";
    selectedFeatures = [];
}

function exportFeatures()
{
	selectedFeatures.forEach(function(obj)
	{
	
	});
}

(function () {
    L.ZoomCenter = L.Class.extend({
        initialize: function(zoom, centerPoint) {
            this.zoom = zoom;
            this.centerPoint = centerPoint;
        }
    });
}());