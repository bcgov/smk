## Vector Layer

<pre>
{ "layers": [ {
    <a href="#id-layer"           >"id"</a>:            "layer1",
    <a href="#type-layer"         >"type"</a>:          "vector",
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
    <a href="#useclustering-vector-layer">"useClustering"</a>: false,
    <a href="#useheatmap-vector-layer"   >"useHeatmap"</a>:    false,
    <a href="#useraw-vector-layer"       >"useRaw"</a>:        true,
    <a href="#style-vector-layer"        >"style"</a>:         { ... },
    <a href="#dataUrl-vector-layer"      >"dataUrl"</a>:       "@layer1",
} ] }
</pre>

### `useClustering` (Vector Layer)
`"useClustering"`: *Boolean* *(OPTIONAL)*  
Indicates if the layer should also include point clustering. 
Only relevant for point geometry layers.
The default is `false`.

### `useHeatmap` (Vector Layer)
`"useHeatmap"`: *Boolean* *(OPTIONAL)*  
Indicates if the layer should also include heatmap clustering. 
Only relevant for point geometry layers.
The default is `false`.

### `useRaw` (Vector Layer)
`"useRaw"`: *Boolean* *(OPTIONAL)*  
Indicates if the layer should be displayed in its native form, with no heatmapping or clustering. 
The default is `true`, unless clustering or heatmapping is enabled.

### `style` (Vector Layer)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the layer.
The object is a [style definition](#style-definition).

### `dataUrl` (Vector Layer)
`"dataUrl"`: *String* *(OPTIONAL)*  
The URL that points to a GeoJSON file containing the vector data.
If this property is missing, the [id](#id-layer) of layer identifies an attachment.




