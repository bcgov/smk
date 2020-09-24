## Identify Tool

Add a button to the toolbar, that *can* show a panel containing a list of features found on the map.
When this tool is enabled, clicking on the map will try to identify all features under the click, within [tolerance](#tolerance-identify-tool) pixels.
The results of this search will be display in the panel, if [showPanel](#showPanel-identify-tool) is true.

<pre>
{ "tools": [ {
    <a href="#type-tool"          >"type"</a>:      "identify",
    <a href="#title-tool"         >"title"</a>:     "Identify",
    <a href="#enabled-tool"       >"enabled"</a>:   false,
    <a href="#icon-tool"          >"icon"</a>:      <a href="https://material.io/tools/icons/?icon=info_outline" target="material">"info_outline"</a>,
    <a href="#order-tool"         >"order"</a>:     4,
    <a href="#position-tool"      >"position"</a>:  "toolbar",
    <a href="#showpanel-identify-tool">"showPanel"</a>: false,
    <a href="#tolerance-identify-tool">"tolerance"</a>: 5,
    <a href="#style-identify-tool"    >"style"</a>:     { ... }
} ] }
</pre>

### `showPanel` (Identify Tool)
`"showPanel"`: *Boolean* *(OPTIONAL)*  
If `true`, then the identify results will be shown in the panel.
If `false`, then the panel won't be shown.
Either way the results are still marked on the map, and clicked on to get a popup with details.

### `tolerance` (Identify Tool)
`"tolerance"`: *Number* *(OPTIONAL)*  
The distance in pixels from the click point that feature must intersect to be found by this tool.

### `style` (Identify Tool)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the feature markers.
The object is a [style definition](#style-definition).

