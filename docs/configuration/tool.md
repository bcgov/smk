## Tool
`"tools"`: *Array[Object]*  *(OPTIONAL)*   
The tools section of configuration controls which tools are available for the user.
The `tools` array contains an object for each tool type being configured.
All tool objects have these configuration properties:

<pre>
{ "tools": [ {
    <a href="#type-tool"    >"type"</a>:     "about",
    <a href="#title-tool"   >"title"</a>:    "About SMK",
    <a href="#enabled-tool" >"enabled"</a>:  true,
    <a href="#icon-tool"    >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"help"</a>,
    <a href="#order-tool"   >"order"</a>:    1,
    <a href="#position-tool">"position"</a>: "toolbar"
} ] }
</pre>

Many of the tools have additional configuration that can set.
Some of the tools are only available for certain [viewers](#type-viewer).
Enabling a tool that is not available for a particular viewer will have no effect.

These are all the tool types available, click on one to see all the properties (and their default values) for that tool type:

<pre>
{ "tools": [
    { "type": <a href="#about-tool">"about"</a> },
    { "type": <a href="#basemaps-tool">"baseMaps"</a> },
    { "type": <a href="#coordinate-tool">"coordinate"</a> },
    { "type": <a href="#directions-tool">"directions"</a> },
    { "type": <a href="#dropdown-tool">"dropdown"</a> },
    { "type": <a href="#identify-tool">"identify"</a> },
    { "type": <a href="#layers-tool">"layers"</a> },
    { "type": <a href="#location-tool">"location"</a> },
    { "type": <a href="#markup-tool">"markup"</a> },
    { "type": <a href="#measure-tool">"measure"</a> },
    { "type": <a href="#menu-tool">"menu"</a> }
    { "type": <a href="#minimap-tool">"minimap"</a> },
    { "type": <a href="#pan-tool">"pan"</a> },
    { "type": <a href="#query-tool">"query"</a> },
    { "type": <a href="#scale-tool">"scale"</a> },
    { "type": <a href="#search-tool">"search"</a> },
    { "type": <a href="#select-tool">"select"</a> },
    { "type": <a href="#version-tool">"version"</a> },
    { "type": <a href="#zoom-tool">"zoom"</a> }
] }
</pre>

### `type` (Tool)
`"type"`: *String* *(REQUIRED)*  
The type of tool to configure.
One of these options:
[`"about"`](#about-tool),
[`"baseMaps"`](#basemaps-tool),
[`"coordinate"`](#coordinate-tool),
[`"directions"`](#directions-tool),
[`"dropdown"`](#dropdown-tool),
[`"identify"`](#identify-tool),
[`"layers"`](#layers-tool),
[`"location"`](#location-tool),
[`"markup"`](#markup-tool),
[`"measure"`](#measure-tool),
[`"menu"`](#menu-tool),
[`"minimap"`](#minimap-tool),
[`"pan"`](#pan-tool),
[`"query"`](#query-tool),
[`"scale"`](#scale-tool),
[`"search"`](#search-tool),
[`"select"`](#select-tool),
[`"version"`](#version-tool),
or 
[`"zoom"`](#zoom-tool).

### `title` (Tool)
`"title"`: *String* *(OPTIONAL)*  
The title of this tool.
How this property is used depends on the tool type.
Tools that display a button on a toolbar use this property for the button tooltip.
Tools that show a panel use this property for the panel title.
All tools have a default title, but setting this property will override it.

### `enabled` (Tool)
`"enabled"`: *Boolean* *(OPTIONAL)*  
If `true` then the tool will be available when the map starts.
If `false`, then the tool will not be available.
Most tools are not enabled by default.

### `icon` (Tool)
`"icon"`: *String* *(OPTIONAL)*  
If the tool adds a button to a toolbar, this property gives the name of the icon to display on the button.
The icon set used is the [Material Design Icons](https://material.io/tools/icons/?icon=query_builder&style=baseline).
Each tool has a default value.

### `order` (Tool)
`"order"`: *Integer* *(OPTIONAL)*  
If the tool adds a button to a toolbar, this property controls the order in which the tools are added to the toolbar.
The default value is `1`, but some tools have other values as their default.
The tools are added left-to-right in ascending order.

### `position` (Tool)
`"position"`: *String* *(OPTIONAL)*  
If the tool adds a button to a toolbar, this property controls which toolbar gets the tool.
The default is `"toolbar"`, but some tools have other default values.
The value of this property is `"toolbar"`; or it can be the name of another tool that can act as a tool container. The tools that can be containers are [`"dropdown"`](#dropdown-tool) or [`"menu"`](#menu-tool).

The tool container must be enabled.

