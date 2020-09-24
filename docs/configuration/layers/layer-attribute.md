## Layer Attribute

<pre>
{ "layers": [ { "id": "fish-points", attributes: [ {
    <a href="#id-layer-attribute"     >"id"</a>:      "species-code",
    <a href="#name-layer-attribute"   >"name"</a>:    "SPECIES_CODE",
    <a href="#title-layer-attribute"  >"title"</a>:   "Species Code",
    <a href="#visible-layer-attribute">"visible"</a>: true
} ] } ] }
</pre>

### `id` (Layer Attribute)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the layer attribute.
This **MUST** be unique within the layer attribute list.
Conventionally it is all lowercase with `-` separating words.

### `name` (Layer Attribute)
`"name"`: *String* *(REQUIRED)*  
The internal name of the attribute.
This must match an attribute name in the feature.

### `title` (Layer Attribute)
`"title"`: *String* *(REQUIRED)*  
The title for the attribute to show the feature popup.

### `visible` (Layer Attribute)
`"visible"`: *Boolean* *(OPTIONAL)*  
Should the attribute be visible in the popup?
Default is `true`.

