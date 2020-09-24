## Layer

`"layers"`: *Array[Object]*  *(OPTIONAL)*   
The layers section of the configuration determines the layers that displayed above the base map.
The `layers` array contains an object for each layer that can be shown on the map.
The first layer object in the array is the top-most layer shown on the map, and the first layer in the [`"layers"`](#layers-tool) panel.

All layer objects have these configuration properties:

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
    <a href="#queries-layer"      >"queries"</a>:       [ ... ]
} ] }
</pre>

There are the types of layers that can configured:
- [`"esri-dynamic"`](#esri-dynamic-layer)
- [`"wms"`](#wms-layer)
- [`"vector"`](#vector-layer)

### `id` (Layer)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the layer.
This **MUST** be unique within the configuration.
Conventionally it is all lowercase with `-` separating words.

### `type` (Layer)
`"type"`: *String* *(REQUIRED)*  
The type of layer object.
One of these options:
[`"esri-dynamic"`](#esri-dynamic-layer),
[`"wms"`](#wms-layer),
or
[`"vector"`](#vector-layer).

### `title` (Layer)
`"title"`: *String* *(REQUIRED)*  
The title to show in the [`"layers"`](#layers-tool) panel.

### `opacity` (Layer)
`"opacity"`: *Number* *(REQUIRED)*  
The value can be from 0 (completely transparent, invisible) to 1 (opaque).
This opacity value is applied over any opacity that may already configured for the layer on the server where it rendered.

### `isVisible` (Layer)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
Should the layer be visible on startup?
Default is `false`.

### `isQueryable` (Layer)
`"isQueryable"`: *Boolean* *(OPTIONAL)*  
Is the layer able to be used for [`"identify"`](#identify-tool) tool?
Default is `true`.

### `minScale` (Layer)
`"minScale"`: *Number* *(OPTIONAL)*  
This value is the denominator of the scale value.
The default is `0`, which means it is not used.
The layer is visible if the current scale is greater than the minimum scale value for the layer.

### `maxScale` (Layer)
`"maxScale"`: *Number* *(OPTIONAL)*  
This value is the denominator of the scale value.
The default is `0`, which means it is not used.
The layer is visible if the current scale is less than the maximum scale value for the layer.

### `attribution` (Layer)
`"attribution"`: *String* *(OPTIONAL)*  
Copyright details and attribution to be displayed in the map viewer container.

### `metadataUrl` (Layer)
`"metadataUrl"`: *String* *(OPTIONAL)*  
The URL used for linking to a metadata source.

### `popupTemplate` (Layer)
`"popupTemplate"`: *String* *(OPTIONAL)*  
A string that contains a [Vue](https://vuejs.org/) template.
The template is used to construct the popup that appears when presenting a feature, in the [`"identify"`](#identify-tool), [`"query"`](#query-tool), and [`"select"`](#select-tool) tools.
The model that is available to the template:
```javascript
// layer configuration
layer.id 
layer.title
layer.attributes // array of objects: { visible, title, name }

// current feature
feature.id
feature.title
feature.properties // object: attribute key:value
```

### `titleAttribute` (Layer)
`"titleAttribute"`: *String* *(OPTIONAL)*  
The name of the attribute to use as the title for a feature from this layer.

### `attributes` (Layer)
`"attributes"`: *Array[Object]* *(OPTIONAL)*  
An array of [layer attribute objects](#layer-attribute).
Used to control how feature attributes appear in the popup that is used by the [`"identify"`](#identify-tool), [`"query"`](#query-tool), and [`"select"`](#select-tool) tools.
The order of the attribute objects, is the order they will appear in the popup.
If this property is `null` or missing, then the popup will show all the attributes of the feature, using the internal field names.
If this property is an empty array (`[]`), then no attributes will be shown for the feature.

### `queries` (Layer)
`"queries"`: *Array[Object]* *(OPTIONAL)*  
An array of [layer query objects](#layer-query).
Used to define the queries that be executed against this layer.

