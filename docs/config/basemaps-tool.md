## BaseMaps Tool

Add a button to the toolbar, that shows a panel which lets the user choose which base map they want the map to use.
[This is the list](#basemap-viewer) of base maps to choose from.
If there is a need to restrict the set of base maps the user can choose from, then set the choices property for this tool.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "baseMaps",
    <a href="#title-tool"       >"title"</a>:    "Base Maps",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=map" target="material">"map"</a>,
    <a href="#order-tool"       >"order"</a>:    3,
    <a href="#position-tool"    >"position"</a>: "menu",
    <a href="#choices-basemaps-tool">"choices"</a>:  null
} ] }
</pre>

### `choices` (BaseMaps Tool)
`"choices"`: *Array[String]* *(OPTIONAL)*  
The list of base maps to let the user choose from.
The names are taken from [this list](#basemap-viewer).

