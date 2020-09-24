## ESRI Dynamic Layer

<pre>
{ "layers": [ {
    <a href="#id-layer"           >"id"</a>:            "layer1",
    <a href="#type-layer"         >"type"</a>:          "esri-dynamic",
    <a href="#title-layer"        >"title"</a>:         "Layer 1",
    <a href="#opacity-layer"      >"opacity"</a>:       0.65,
    <a href="#isvisible-layer"    >"isVisible"</a>:     true,
    <a href="#isqueryable-layer"  >"isQueryable"</a>:   true,
    <a href="#minscale-layer"     >"minScale"</a>:      500000,
    <a href="#maxscale-layer"     >"maxScale"</a>:      0,
    <a href="#attribution-layer"  >"attribution"</a>:   "Copyright 2018",
    <a href="#metadataurl-layer"  >"metadataUrl"</a>:   "http://catalogue/dataset/aca81811-4b08-4382-9af7-204e0b9d2448",
    <a href="#popuptemplate-layer">"popupTemplate"</a>: "&lt;div class=\"smk-header\">&lt;h3>{{ layer.title }}&lt;/h3>&lt;/div>",    
    <a href="#titleattribute-layer">"titleAttribute"</a>:"INTRID_SID",
    <a href="#attributes-layer"   >"attributes"</a>:    [ ... ],
    <a href="#queries-layer"      >"queries"</a>:       [ ... ],
    <a href="#mpcmid-esri-dynamic-layer"       >"mpcmId"</a>:        123,
    <a href="#mpcmworkspace-esri-dynamic-layer">"mpcmWorkspace"</a>: "MPCM_ALL_PUB",
    <a href="#serviceurl-esri-dynamic-layer"   >"serviceUrl"</a>:    "https://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer",
    <a href="#dynamiclayers-esri-dynamic-layer">"dynamicLayers"</a>: [ ... ],
} ] }
</pre>

### `mpcmId` (ESRI Dynamic Layer)
`"mpcmId"`: *String* *(REQUIRED)*  
The ID used for this layer in the DataBC Layer Catalog.

### `mpcmWorkspace` (ESRI Dynamic Layer)
`"mpcmWorkspace"`: *String* *(REQUIRED)*  
The workspace used for this layer in the DataBC Layer Catalog.

### `serviceUrl` (ESRI Dynamic Layer)
`"serviceUrl"`: *String* *(REQUIRED)*  
The URL for the DataBC Layer Catalog.

### `dynamicLayers` (ESRI Dynamic Layer)
`"dynamicLayers"`: *Array[String]* *(REQUIRED)*  
A listing of dynamic layer configurations. 
This will typically only contain one dynamic feature, which can be derived from the MPCM Layer Catalog.




