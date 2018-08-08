require([
	  "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/geometry/SpatialReference",
      /* widgets */
      "esri/widgets/Expand",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Legend",
      "esri/widgets/Home",
      "esri/widgets/LayerList",
      /* layers and rendering */
      "esri/layers/MapImageLayer",
      "esri/layers/WMSLayer",
      "esri/renderers/SimpleRenderer",
	  "esri/renderers/UniqueValueRenderer",
	  "esri/renderers/ClassBreaksRenderer",
      /* dojo stuff */
      "dojo/domReady!"
    ], 
function(esriConfig, Map, MapView, SpatialReference,
		 Expand, BasemapGallery, Legend, Home, LayerList,
		 MapImageLayer, WMSLayer, SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer) 
{
	var layerExtras = [];
	
	var map = new Map(
	{
		basemap: "topo",
		ground: "world-elevation"
	});

	var view = new MapView(
	{
		container: "map",
		map: map,
		zoom: 6,
		center: [-124.65, 54.23]
	});
	
	initViewActions(view);
	
	// init widgets
	// Home
	var homeBtn = new Home(
	{
        view: view
    });

	view.ui.add(homeBtn, "top-left");

	// configure an expander ui section for the home page content
	
	var homeContentWrapper = "<div id='homeContent' style='padding: 15px; max-width: 600px; height: calc(100vh - 175px); width: calc(100vw - 115px); background-color: rgba(255, 255, 255, 0.8);'>" + $('#homepageDetails').html().toString() + "</div>";
	$('#homepageDetails').remove()
	
	var homeContentExpander = new Expand(
	{
		view: view,
		content: homeContentWrapper,
		expandIconClass: "esri-icon-public",
		expanded: true
	});
	
	view.ui.add(homeContentExpander, "top-right");
	
	var basemapGallery = new BasemapGallery(
	{
		view: view,
		container: document.createElement("div")
	});
	
	var bgExpand = new Expand(
	{
		view: view,
		content: basemapGallery.container,
		expandIconClass: "esri-icon-basemap"
	});

	view.ui.add(bgExpand, "top-right");

	// Add the widget to the top-right corner of the view
	view.ui.add(basemapGallery, 
	{
		position: "top-right"
	});

	// create legend when view is updated
	view.then(function() 
	{
		// layer list when view is updated
		var layerList = new LayerList(
        {
        	view: view,
        	// executes for each ListItem in the LayerList
        	listItemCreatedFunction: defineLayerListActions,
        	container: document.createElement("div")
        });
        
        // configure layer list events
        layerList.on("trigger-action", function(event) 
        {
        	layerListActions(event);
        });
        
        // Add widget to the top right corner of the view
        var layerExpand = new Expand(
		{
			view: view,
			content: layerList.container,
			expandIconClass: "esri-icon-layers"
		});

		view.ui.add(layerExpand, "top-right");
        
		// configure layerinfos
		var layerInfos = [];
		
		for (var lyr in map.layers.items) 
		{
			for (var lyr in lyr.sublayers) 
			{
				layerInfos.push(
				{
					layer: lyr,
					title: lyr.title
				});
			}
		}
		
		// add legend
		var legend = new Legend(
		{
			view: view,
			container: document.createElement("div"),
			layerInfos: layerInfos
		});
		
		var legendExpand = new Expand(
		{
			view: view,
			content: legend.container,
			expandIconClass: "esri-icon-public"
		});

		view.ui.add(legendExpand, "top-right");
	});
	
	//*** Initialize public functions for map document initialization ***//

	var mpcmRootLayer;
	
	// set default basemap
	var setBasemap = function(name)
	{
		if(name == "Topographic") map.basemap = "topo";
		else if(name == "Streets") map.basemap = "streets";
		else if(name == "Imagery") map.basemap = "satellite";
		else if(name == "Oceans") map.basemap = "oceans";
		else if(name == "NationalGeographic") map.basemap = "national-geographic";
		else if(name == "DarkGray") map.basemap = "dark-gray";
		else if(name == "Gray") map.basemap = "gray";
		else map.basemap = "topo";
	}
	
	// function calls for inserting layers
	var createMpcmLayer = function(title, url, layerId, dynamicJson, visibility, opacity, metadataLink, minScale, maxScale, popupTemplate) 
    {
		esriConfig.request.corsEnabledServers.push(url.replace(/(^\w+:|^)\/\//, ''));
		if(!mpcmRootLayer)
		{
			mpcmRootLayer = new MapImageLayer(
			{
				url: url,
				title: "DataBC Catalog",
				visible: true,
				sublayers:  []
			});
			
			map.layers.add(mpcmRootLayer);
		}
		
		// build the sublayer
		dynamicJson = dynamicJson[0];
		var renderer;
		if(dynamicJson.drawingInfo.renderer.type == "uniqueValue")
		{
			renderer = UniqueValueRenderer.fromJSON(dynamicJson.drawingInfo.renderer);
		}
		else if(dynamicJson.drawingInfo.renderer.type == "classBreaks")
		{
			renderer = ClassBreaksRenderer.fromJSON(dynamicJson.drawingInfo.renderer);
		}
		else renderer = SimpleRenderer.fromJSON(dynamicJson.drawingInfo.renderer)
		
		var popupParsed;
		if(popupTemplate && popupTemplate != "") popupParsed = JSON.parse(popupTemplate);
		
		var sl = 
		{
			id: dynamicJson.id,
	        title: title,
	        opacity: opacity,
	        definitionExpression: dynamicJson.definitionExpression,
	        labelsVisible: dynamicJson.labelsVisible,
	        renderer: renderer,
	        source: dynamicJson.source,
	        visible: visibility,
	        labelingInfo: dynamicJson.labelingInfo,
	        popupTemplate: popupParsed
		}
		
		layerExtras.push(
		{
			id: dynamicJson.id,
			metadata: metadataLink,
			minScale: minScale,
			maxScale: maxScale
		});
		
		// add popup templates to sl: popupTemplate: popupTemplate. We can build the popup template
		// in the java side and inject here... might make the process a little slower though?
		
		mpcmRootLayer.sublayers.push(sl);
    };
    
    var createWmsLayer = function(title, url, version, layerName, style, attribution, visible, opacity) 
    {
    	esriConfig.request.corsEnabledServers.push(url.replace(/(^\w+:|^)\/\//, ''));
    	
    	var layer = new WMSLayer(
    	{
    		title: title,
    		url: url,
    		version: version,
    		copyright: attribution,
    		imageTransparency: true,
    		opacity: opacity,
    		visible: true,
    		featureInfoUrl: url,
    		spatialReference: SpatialReference.WebMercator
        });
    	
    	map.layers.add(layer);
    }
    
    dojo.setObject('setBasemap', setBasemap);
    dojo.setObject('createMpcmLayer', createMpcmLayer);
    dojo.setObject('createWmsLayer', createWmsLayer);
    
    // trigger ajax processes
    esri3dInit();
    
    function defineLayerListActions(event) 
    {
        var item = event.item;
        item.actionsSections = 
        [[
            {
                title: "Go to full scale",
        		className: "esri-icon-zoom-out-fixed",
        		id: "max-scale"
        	}, 
        	{
        		title: "Layer information",
        		className: "esri-icon-description",
        		id: "information"
            }
         ],
         [
            {
            	title: "Increase opacity",
            	className: "esri-icon-up",
            	id: "increase-opacity"
            }, 
            {
            	title: "Decrease opacity",
            	className: "esri-icon-down",
            	id: "decrease-opacity"
            }]
        ];
    }
    
    function layerListActions(event)
    {
    	// The layer visible in the view at the time of the trigger.
    	var visibleLayer = event.item.layer;
        // Capture the action id.
        var id = event.action.id;
        
        if (id === "max-scale") 
        {
        	var scale = visibleLayer.maxScale;
        	
        	for(var i = 0; i < layerExtras.length; i++) 
			{
        		var lyrId = layerExtras[i].id;
				var lyrScale = layerExtras[i].minScale;
				
				if(lyrId == visibleLayer.id)
				{
					scale = lyrScale;
					break;
				}
			}
        	
        	view.goTo({
				scale: scale
			  });
        } 
        else if (id === "information") 
        {
        	var link = visibleLayer.url;
        	
        	for(var i = 0; i < layerExtras.length; i++) 
			{
        		var lyrId = layerExtras[i].id;
				var metaLink = layerExtras[i].metadata;
				
				if(lyrId == visibleLayer.id)
				{
					link = metaLink;
					break;
				}
			}
        	
        	window.open(link);
          } 
          else if (id === "increase-opacity") 
          {
        	  // if the increase-opacity action is triggered, then
        	  // increase the opacity of the GroupLayer by 0.25

        	  if (visibleLayer.opacity < 1) 
        	  {
        		  visibleLayer.opacity += 0.25;
        	  }
          } 
          else if (id === "decrease-opacity") 
          {
        	  // if the decrease-opacity action is triggered, then
        	  // decrease the opacity of the GroupLayer by 0.25

        	  if (visibleLayer.opacity > 0) 
        	  {
        		  visibleLayer.opacity -= 0.25;
        	  }
        }
    }
    
    // Helper methods for renderers, etc.
    function initViewActions(view)
	{
		view.on("click", function(event) 
		{
			//event.stopPropagation(); // overwrite default click-for-popup behavior

	        // Get the coordinates of the click on the view
	        //var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
	        //var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

	        //alert("lat: " + lat + " lon: " + lon);
	        
	        /*
	        view.popup.open(
	        {
	        	// Set the popup's title to the coordinates of the location
	        	title: "Reverse geocode: [" + lon + ", " + lat + "]",
	        	location: event.mapPoint // Set the location of the popup to the clicked location
	        });

	        // Display the popup
	        // Execute a reverse geocode using the clicked location
	        locatorTask.locationToAddress(event.mapPoint).then(function(response) 
	        {
	        	// If an address is successfully found, show it in the popup's content
	        	view.popup.content = response.address;
	        }).otherwise(function(err) 
	        {
	        	// If the promise fails and no result is found, show a generic message
	        	view.popup.content =
	            "No address was found for this location";
	        });
	        */
		});
	}
});