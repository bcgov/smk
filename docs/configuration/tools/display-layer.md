## Display Layer

<pre>
{
    <a href="#id-display-layer"        >"id"</a>:        "layer1",
    <a href="#type-display-layer"      >"type"</a>:      "layer",
    <a href="#title-display-layer"     >"title"</a>:     "Layer 1",
    <a href="#isvisible-display-layer" >"isVisible"</a>: true,
}
</pre>

### `id` (Display Layer)
`"id"`: *String* *(REQUIRED)*  
The id of a layer from the [layers](#layer) section of the configuration.

### `type` (Display Layer)
`"type"`: *String* *(REQUIRED)*  
The type must be `"layer"`.

### `title` (Display Layer)
`"title"`: *String* *(OPTIONAL)*  
The title to show for the layer. 
Defaults to the title defined in the [layers](#layer) section.

### `isVisible` (Display Layer)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
If the layer is to be visible initially.
Defaults to the isVisible flag defined in the [layers](#layer) section.


