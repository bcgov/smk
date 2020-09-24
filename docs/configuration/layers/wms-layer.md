## WMS Layer

<pre>
{ "layers": [ {
    <a href="#id-layer"           >"id"</a>:                "layer1",
    <a href="#type-layer"         >"type"</a>:              "wms",
    <a href="#title-layer"        >"title"</a>:             "Layer 1",
    <a href="#opacity-layer"      >"opacity"</a>:           0.65,
    <a href="#isvisible-layer"    >"isVisible"</a>:         true,
    <a href="#isqueryable-layer"  >"isQueryable"</a>:       true,
    <a href="#minscale-layer"     >"minScale"</a>:          500000,
    <a href="#maxscale-layer"     >"maxScale"</a>:          0,
    <a href="#attribution-layer"  >"attribution"</a>:       "Copyright 2018",
    <a href="#metadataurl-layer"  >"metadataUrl"</a>:       "http://catalogue/dataset/aca81811-4b08-4382-9af7-204e0b9d2448",
    <a href="#popuptemplate-layer">"popupTemplate"</a>:     "&lt;div class=\"smk-header\">&lt;h3>{{ layer.title }}&lt;/h3>&lt;/div>",        
    <a href="#titleattribute-layer">"titleAttribute"</a>:"INTRID_SID",
    <a href="#attributes-layer"   >"attributes"</a>:        [ ... ],
    <a href="#queries-layer"      >"queries"</a>:           [ ... ],
    <a href="#version-wms-layer"          >"version"</a>:           1.0.0,
    <a href="#layername-wms-layer"        >"layerName"</a>:         "WHSE_TANTALIS.TA_CROWN_LEASES_SVW",
    <a href="#stylename-wms-layer"        >"styleName"</a>:         "Lease_Applications_Tantalis_Colour_Filled",
    <a href="#serviceurl-wms-layer"       >"serviceUrl"</a>:        "https://openmaps.gov.bc.ca/geo/pub/wms",
    <a href="#geometryattribute-wms-layer">"geometryAttribute"</a>: "SHAPE"
} ] }
</pre>

### `version` (WMS Layer)
`"version"`: *String* *(OPTIONAL)*  
The WMS version used for GetMap, GetFeatureInfo and GetCapabilities WMS requests.

### `layerName` (WMS Layer)
`"layerName"`: *String* *(REQUIRED)*  
The name of the layer to use when making get map requests for the WMS layer.

### `styleName` (WMS Layer)
`"styleName"`: *String* *(OPTIONAL)*  
The name of the style to use when making get map requests for the WMS layer.

### `serviceUrl` (WMS Layer)
`"serviceUrl"`: *String* *(REQUIRED)*  
The URL for the WMS service.

### `geometryAttribute` (WMS Layer)
`"geometryAttribute"`: *String* *(OPTIONAL)*  
The name of the layer attribute that contains the geometry.
(Needed by the [`"identify"`](#identify-tool) tool).






