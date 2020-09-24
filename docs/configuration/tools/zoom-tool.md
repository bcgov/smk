## Zoom Tool

If this tool is enabled, then the user is able to change the zoom level of the map.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:        "zoom",
    <a href="#enabled-tool"     >"enabled"</a>:     false,
    <a href="#mousewheel-zoom-tool" >"mouseWheel"</a>:  true,
    <a href="#doubleclick-zoom-tool">"doubleClick"</a>: true,
    <a href="#box-zoom-tool"        >"box"</a>:         true,
    <a href="#control-zoom-tool"    >"control"</a>:     true
} ] }
</pre>

### `mouseWheel` (Zoom Tool)
`"mouseWheel"`: *Boolean* *(OPTIONAL)*  
If `true`, then the map can be zoomed with the mouse wheel.

### `doubleClick` (Zoom Tool)
`"doubleClick"`: *Boolean* *(OPTIONAL)*  
If `true`, then the map will zoom-in on a double-click.

### `box` (Zoom Tool)
`"box"`: *Boolean* *(OPTIONAL)*  
If `true`, then the user can hold the **shift** key and drag a box on the map to zoom in.

### `control` (Zoom Tool)
`"control"`: *Boolean* *(OPTIONAL)*  
If `true`, then there are zoom-in, zoom-out buttons on the map.







