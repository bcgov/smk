## Layers Tool

Add a button to the toolbar, that shows a panel that lists all the layers configured for the map.
It allows the user to hide or show any layer, and to see the layer legend.
Use the [display](#display-layers-tool) property to organize the layers into folders and groups.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "layers",
    <a href="#title-tool"       >"title"</a>:    "Layers",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=layers" target="material">"layers"</a>,
    <a href="#order-tool"       >"order"</a>:    3,
    <a href="#position-tool"    >"position"</a>: "menu",
    <a href="#display-layers-tool">"display"</a>:  [ ... ],
} ] }
</pre>

### `display` (Layers Tool)
`"display"`: *Array[Object]* *(OPTIONAL)*  
A collection of [layer display](#layer-display-definition) objects.

