
# SMK Client Configuration
This section presents a complete, annotated SMK map configuration.
The configuration is presented as a [JSON](https://www.json.org/) structure, because that is how it is stored, and passed into the SMK client.

This is the toplevel structure of the JSON object.
Click on a key to get more information.

<pre>
{  
    <a href="#metadata">"smkId"</a>:       "smk-demo-app",  
    <a href="#metadata">"smkRevision"</a>: 1,  
    <a href="#metadata">"createdBy"</a>:   "smk",  
    <a href="#metadata">"published"</a>:   false,  
    <a href="#metadata">"name"</a>:        "SMK Demo App",  
    <a href="#metadata">"project"</a>:     "Demo",  
    <a href="#viewer"  >"viewer"</a>:      { ... },  
    <a href="#tool"    >"tools"</a>:       [ ... ],  
    <a href="#layer"   >"layers"</a>:      [ ... ] 
}
</pre>

## Metadata

The configuration metadata is the name of the project, who created it, and where it is in it's lifetime.
The values are controlled by the Admin UI, and there is no reason for the application to change them (except possibly `"name"`).

<pre>
{  
    <a href="#smkid-metadata"      >"smkId"</a>:       "smk-demo-app",  
    <a href="#smkrevision-metadata">"smkRevision"</a>: 1,  
    <a href="#createdby-metadata"  >"createdBy"</a>:   "smk",  
    <a href="#published-metadata"  >"published"</a>:   false,  
    <a href="#name-metadata"       >"name"</a>:        "SMK Demo App",  
    <a href="#project-metadata"    >"project"</a>:     "Demo",  
}
</pre>

### `smkId` (Metadata)
`"smkId"`: *String*  *(REQUIRED)*  
The identifer for the Map Configuration.
Derived from the name, and used by the Admin UI.

### `name` (Metadata)
`"name"`: *String*  *(REQUIRED)*  
The name of the SMK configuration. 
This name is used to identify the configuration in the Admin UI, as well as the title for the script attribute [`smk-title-sel`](./SMK-Client-API.md#smk-title-sel-attribute)

### `project` (Metadata)
`"project"`: *String*  *(OPTIONAL)*  
A optional identifier used to group together related map configurations in the Admin UI.

### `smkRevision` (Metadata)
`"smkRevision"`: *Integer*  *(REQUIRED)*  
The current version of the Map Configuration. This will increment when a version is published and a new edit version created.

### `createdBy` (Metadata)
`"createdBy"`: *String*  *(REQUIRED)*  
The name of the user (BCeID or IDIR) that created this Map Configuration.

### `published` (Metadata)
`"published"`: *Boolean*  *(REQUIRED)*  
If `true`, this project is a published version; otherwise this is an editable, in progress version.

## Viewer
`"viewer"`: *Object*  *(OPTIONAL)*   
The viewer section of configuration controls general aspects of the map viewer itself.

<pre>
{ "viewer": {  
    <a href="#type-viewer"          >"type"</a>:          "leaflet",  
    <a href="#basemap-viewer"       >"baseMap"</a>:       "Topographic",  
    <a href="#clusterOption-viewer" >"clusterOption"</a>: { ... },  
    <a href="#location-viewer">"location"</a>: {  
        <a href="#locationextent-viewer">"extent"</a>: [ -139.1782, 47.6039, -110.3533, 60.5939 ],  
        <a href="#locationcenter-viewer">"center"</a>: [ -124.76575, 54.0989 ],  
        <a href="#locationzoom-viewer"  >"zoom"</a>:   5,  
    }  
} }
</pre>

### `type` (Viewer)
`"type"`: *String*  *(OPTIONAL)*  
The type of map viewer to use. There are two options:

- `"leaflet"` Use the [Leaflet](https://leafletjs.com/) viewer. (Default) 
- `"esri3d"` Use the [ESRI ArcGIS 3D](https://developers.arcgis.com/javascript/) viewer.

### `baseMap` (Viewer)
`"baseMap"`: *String*  *(OPTIONAL)*  
The name of the default basemap to display.
One of these options:
`"Topographic"` (Default),
`"Streets"`,
`"Imagery"`,
`"Oceans"`,
`"NationalGeographic"`,
`"ShadedRelief"`,
`"DarkGray"`,
or
`"Gray"`.

### `clusterOption` (Viewer)
`"clusterOption"`: *Object*  *(OPTIONAL)*  
*This option only applies to the [leaflet viewer](#type-viewer).*

A configuration object that is passed to the clustering object constructor.
The options are [defined here](https://github.com/Leaflet/Leaflet.markercluster#all-options).
One use for this configuration is to control if the convex hull of clusters is displayed, (default for this option is `false`):
```
{ "viewer": { "clusterOption" {
    "showCoverageOnHover": true
} } }
```

### `location` (Viewer)
`"location"`: *Object*  *(OPTIONAL)*  
The location that map shows when the map starts.
The default value is the map centered on BC, at zoom level 5, which shows the whole province.

### `location.extent` (Viewer)
`"extent"`: *Array[Number]* *(OPTIONAL)*  
The extent which must be displayed by the map at startup. 
The array contains 4 values, which are in order: *`[MIN-LONG]`*,*`[MIN-LAT]`*,*`[MAX-LONG]`*,*`[MAX-LAT]`*.
This take precedence over any center and zoom settings.

### `location.center` (Viewer)
`"center"`: *Array[Number]* *(OPTIONAL)*  
The center point of the map at startup. 
The array contains 2 values, which are in order: *`[LONG]`*,*`[LAT]`*.

### `location.zoom` (Viewer)
`"zoom"`: *Integer* *(OPTIONAL)*  
The zoom level of the map at startup. 
This is a value from 0 (whole world) to 30.
The default value is 5, which shows the whole province of BC.






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

## About Tool

Add a button to the toolbar, that shows a panel with content that taken from the configuration.
It can be used to show any content that the application needs.

<pre>
{ "tools": [ {
    <a href="#type-tool"     >"type"</a>:     "about",
    <a href="#title-tool"    >"title"</a>:    "About SMK",
    <a href="#enabled-tool"  >"enabled"</a>:  false,
    <a href="#icon-tool"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"help"</a>,
    <a href="#order-tool"    >"order"</a>:    1,
    <a href="#position-tool" >"position"</a>: "toolbar",
    <a href="#content-about-tool">"content"</a>:  null
} ] }
</pre>

### `content` (About Tool)
`"content"`: *String* *(OPTIONAL)*  
The content to show in the panel.
This is assumed to be formatted in HTML.
Any styling should be inline in the HTML, or refer to classes that are defined by the enclosing application.

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

## Coordinate Tool

Adds a coordinate display to the bottom-right corner of the map.
This display shows the current latitude and longitude of the mouse cursor.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "coordinate",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
} ] }
</pre>

## Directions Tool

Add a button to the toolbar, that shows a panel that allows the user to pick locations on the map, and calculate the fastest (or shortest) route between them.

This tool interacts with the [`"identify"`](#identify-tool) and [`"location"`](#location-tool) tools.
When this tool is enabled, the popups for identify and location will contain a button to start a route from that location.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "directions",
    <a href="#title-tool"       >"title"</a>:    "Directions",
    <a href="#enabled-tool"     >"enabled"</a>:  true,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=directions_car" target="material">"directions_car"</a>,
    <a href="#order-tool"       >"order"</a>:    4,
    <a href="#position-tool"    >"position"</a>: "toolbar",
    <a href="#apikey-directions-tool">"apiKey"</a>:   "...",
} ] }
</pre>

### `apiKey` (Directions Tool)
`"apiKey"`: *String* *(REQUIRED)*  
The API key used to get access the [BC Route Planner API](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/route-planner).
The API key is required to access the service, the directions tool won't work without it.

## Dropdown Tool

Add a button to the toolbar, that shows a panel that contains other tools.
The tools are presented as a drop-down list at the top of the panel, using the titles of the tools.
When a tool is selected, it's panel is displayed below the drop-down.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "dropdown",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=arrow_drop_down_circle" target="material">"arrow_drop_down_circle"</a>,
    <a href="#order-tool"       >"order"</a>:    1,
    <a href="#position-tool"    >"position"</a>: "toolbar",
} ] }
</pre>

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

## Location Tool

If this tool is enabled, then clicking on the map will show a popup giving the clicked point's location.
If the [`"identify"`](#identify-tool) or [`"directions"`](#directions-tool) tools are enabled, then buttons are visible on this popup with additional actions.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "location",
    <a href="#title-tool"       >"title"</a>:    "Location",
    <a href="#enabled-tool"     >"enabled"</a>:  true,
} ] }
</pre>

## Markup Tool

*This tool only works with the [leaflet viewer](#type-viewer).*

Adds markup tools to the map.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "markup",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
} ] }
</pre>

## Measure Tool

Add a button to the toolbar, that shows a panel that allows the user to measure distances or areas on the map.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "measure",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=straighten" target="material">"straighten"</a>,
    <a href="#order-tool"       >"order"</a>:    2,
    <a href="#position-tool"    >"position"</a>: "toolbar",
} ] }
</pre>

## Menu Tool

Add a button to the toolbar, that shows a panel that contains other tools.
The tools are arranged in a toolbar across the top of the panel.
When a tool is selected, it's panel is displayed below the toolbar.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "menu",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=menu" target="material">"menu"</a>,
    <a href="#order-tool"       >"order"</a>:    1,
    <a href="#position-tool"    >"position"</a>: "toolbar",
} ] }
</pre>

## Minimap Tool

*This tool only works with the [leaflet viewer](#type-viewer).*

Adds an overview map in the bottom-right corner of the map.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "minimap",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
} ] }
</pre>

## Pan Tool

If this tool is enabled, then the user is able to change the center location of the map.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "pan",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
} ] }
</pre>

## Query Tool

Add a button to the toolbar, that shows a panel containing an input form.
When user fills out the form and clicks the 'Search' button, a query is performed on a layer, and the results are shown at bottom of the panel, as well as on the map.

The [queries](#queries-layer) are defined on layer objects, this tool needs to know which query to use.
The [instance](#instance-query-tool) property must contain the id of the [query object](#layer-query) (which is associated with a layer).

This tool is the only one that can appear multiple times in the map configuration, but each one must have a different [instance](#instance-query-tool) value.

The title of the panel and tool button come from the query.
The [icon](#icon-tool), [order](#order-tool), and [position](#position-tool) can be different for each [instance](#instance-query-tool) value.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "query",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=question_answer" target="material">"question_answer"</a>,
    <a href="#order-tool"       >"order"</a>:    4,
    <a href="#position-tool"    >"position"</a>: "toolbar",
    <a href="#instance-query-tool"  >"instance"</a>: null,
    <a href="#style-query-tool"     >"style"</a>:    { ... }
} ] }
</pre>

### `instance` (Query Tool)
`"instance"`: *String* *(REQUIRED)*  
This must be the id of a query object.

### `style` (Query Tool)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the feature markers.
The object is a [style definition](#style-definition).

## Scale Tool

Adds a scale display to the bottom-right corner of the map.
This display shows the current scale, and a ruler showing the real ground distance.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:       "scale",
    <a href="#enabled-tool"     >"enabled"</a>:    false,
    <a href="#showfactor-scale-tool">"showFactor"</a>: true
    <a href="#showbar-scale-tool"   >"showBar"</a>:    true
} ] }
</pre>

### `showFactor` (Scale Tool)
`"showFactor"`: *Boolean* *(OPTIONAL)*  
If `true`, then the scale display shows the scale factor.

### `showBar` (Scale Tool)
`"showBar"`: *Boolean* *(OPTIONAL)*  
If `true`, then the scale display shows the distance ruler.

## Search Tool

Add a search input field to the toolbar.
The text entered in the input field is used to perform a location search.
The results are marked on the map, and displayed in a panel.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "search",
    <a href="#title-tool"       >"title"</a>:    "Search",
    <a href="#enabled-tool"     >"enabled"</a>:  true,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=search" target="material">"search"</a>,
    <a href="#order-tool"       >"order"</a>:    2,
    <a href="#position-tool"    >"position"</a>: "toolbar",
} ] }
</pre>

## Select Tool

Add a button to the toolbar, that shows a panel containing the current selection set.
When this tool is enabled, the [`"identify"`](#identify-tool) tool has an additional action available for features.
The feature can be copied to the selection, so it appears in this panel.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "baseMaps",
    <a href="#title-tool"       >"title"</a>:    "Base Maps",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=map" target="material">"map"</a>,
    <a href="#order-tool"       >"order"</a>:    3,
    <a href="#position-tool"    >"position"</a>: "menu",
    <a href="#style-select-tool">"style"</a>:    { ... }
} ] }
</pre>

### `style` (Select Tool)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the feature markers.
The object is a [style definition](#style-definition).

## Version Tool

Add a button to the toolbar, that shows a panel containing the version of SMK, and build information.
This is for debugging purposes.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "version",
    <a href="#title-tool"       >"title"</a>:    "SMK Build Info",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=build" target="material">"build"</a>,
    <a href="#order-tool"       >"order"</a>:    1,
    <a href="#position-tool"    >"position"</a>: "menu"
} ] }
</pre>

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

## Layer Query

<pre>
{ "layers": [ { "id": "fish-points", queries: [ {
    <a href="#id-layer-query"         >"id"</a>:          "species",
    <a href="#title-layer-query"      >"title"</a>:       "Find by species",
    <a href="#description-layer-query">"description"</a>: "Find fish points that match by species code or name.",
    <a href="#parameters-layer-query" >"parameters"</a>:  [ ... ],
    <a href="#predicate-layer-query"  >"predicate"</a>:   { ... }
} ] } ] }
</pre>

### `id` (Layer Query)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the query.
This **MUST** be unique within the layer query list.
Conventionally it is all lowercase with `-` separating words.

### `title` (Layer Query)
`"title"`: *String* *(REQUIRED)*  
The title for the query, that will be uses for the [`"query"`](#query-tool) tool button.

### `description` (Layer Query)
`"description"`: *String* *(REQUIRED)*  
A longer description of the query, that is shown on the panel above the query parameter form.

### `parameters` (Layer Query)
`"parameters"`: *Array[Object]* *(REQUIRED)*  
An array of [layer query parameter objects](#layer-query-parameter).
Used to define the parameters that the user must provide the query.

### `predicate` (Layer Query)
`"predicate"`: *Object* *(REQUIRED)*  
A [layer query predicate object](#layer-query-predicate).
Used to define the query that is to be executed against the layer.

## Layer Query Parameter

Configures a parameter that will be used by the [query predicate](#layer-query-predicate).

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#title-layer-query-parameter"      >"title"</a>: "Species Name or Code",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "input"
} ] } ] } ] }
</pre>

### `id` (Layer Query Parameter)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the parameter.
This **MUST** be unique within the layer query parameter list.
Conventionally it is all lowercase with `-` separating words.

### `title` (Layer Query Parameter)
`"title"`: *String* *(REQUIRED)*  
The title to show in query form for this parameter.

### `value` (Layer Query Parameter)
`"value"`: *String* *(OPTIONAL)*  
The default value for the parameter.
If not provided, the user **MUST** provide a value to execute the query.

### `type` (Layer Query Parameter)
`"type"`: *String* *(REQUIRED)*  
The type of form entry field to use.
One of these options:
[`"constant"`](#constant-layer-query-parameter),
[`"input"`](#input-layer-query-parameter),
[`"select"`](#select-layer-query-parameter),
or
[`"select-unique"`](#select-unique-layer-query-parameter).

## Constant Layer Query Parameter

Use a constant parameter to provide a constant value to the [query predicate](#layer-query-predicate).
If the [title](#title-layer-query-parameter) is configured, then the constant is shown in query form, otherwise it is hidden.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "constant"
} ] } ] } ] }
</pre>

## Input Layer Query Parameter

Use an input parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user entering into an input field.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#title-layer-query-parameter"      >"title"</a>: "Species Name or Code",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "input"
} ] } ] } ] }
</pre>

## Select Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user picking a value from a drop-down list.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"            >"id"</a>:      "species-name",
    <a href="#title-layer-query-parameter"         >"title"</a>:   "Species Name or Code",
    <a href="#value-layer-query-parameter"         >"value"</a>:   "salmon",
    <a href="#type-layer-query-parameter"          >"type"</a>:    "select",
    <a href="#choices-select-layer-query-parameter">"choices"</a>: [ ... ]
} ] } ] } ] }
</pre>

### `choices` (Select Layer Query Parameter)
`"choices"`: *Array[Object]* *(REQUIRED)*  
An array of `{ title, value }` objects to populate a drop-down list.
The `title` is optional.

## Select Unique Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user picking a value from a drop-down list.
The drop-down list is populated dynamically from the layer by finding all unique values for [uniqueAttribute]().
If the request to populate the drop-down fails, the drop-down field changes to an input field.
The [choices](#choices-select-layer-query-parameter) property may be used as well to provide a fall-back. 

**DO NOT** use this parameter type if you know the number of unique values will be more than a few hundred.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"                        >"id"</a>:              "species-name",
    <a href="#title-layer-query-parameter"                     >"title"</a>:           "Species Code",            
    <a href="#type-layer-query-parameter"                      >"type"</a>:            "select-unique",
    <a href="#uniqueattribute-select-unique-layer-query-parameter">"uniqueAttribute"</a>: "SPECIES_CODE"
} ] } ] } ] }
</pre>

### `uniqueAttribute` (Select Layer Query Parameter)
`"uniqueAttribute"`: *Array[Object]* *(REQUIRED)*  
The name of the attribute on the layer that will be queried to find all unique values.

## Layer Query Predicate

Defines the query to be executed against the layer.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate" >"operator"</a>:  "or",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

### `operator` (Layer Query Predicate)
`"operator"`: *String* *(REQUIRED)*  
The operation to apply to the arguments.
One of these options:
[`"and"`](#layer-query-predicate-and-operator),
[`"or"`](#layer-query-predicate-or-operator),
[`"not"`](#layer-query-predicate-not-operator),
[`"equals"`](#layer-query-predicate-equals-operator),
[`"less-than"`](#layer-query-predicate-less-than-operator),
[`"greater-than"`](#layer-query-predicate-greater-than-operator),
[`"contains"`](#layer-query-predicate-contains-operator),
[`"starts-with"`](#layer-query-predicate-starts-with-operator),
or
[`"ends-with"`](#ends-with-operator-layer-query-predicate).

## Layer Query Predicate AND Operator

The query predicate holds if **ALL** of it's arguments hold.
There must be at least one argument.
The arguments are [layer query predicate](#layer-query-predicate) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "and",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate OR Operator

The query predicate holds if **AT LEAST ONE** of it's arguments hold.
There must be at least one argument.
The argument are [layer query predicate](#layer-query-predicate) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "or",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate NOT Operator

The query predicate holds if it's argument fails.
There must be **EXACTLY** one argument.
The argument is a [layer query predicate](#layer-query-predicate) object.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "not",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate EQUALS Operator

The query predicate holds if the first operand equals the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "equals",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate LESS-THAN Operator

The query predicate holds if the first operand is strictly less than the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "less-than",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate GREATER-THAN Operator

The query predicate holds if the first operand is strictly greater than the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "greater-than",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate CONTAINS Operator

The query predicate holds if the first operand contains the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "contains",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate STARTS-WITH Operator

The query predicate holds if the first operand starts with the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "starts-with",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate END-WITH Operator

The query predicate holds if the first operand ends with the second operand.
There must be exactly 2 arguments.
The arguments are [layer query predicate operand](#layer-query-predicate-operand) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "ends-with",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

## Layer Query Predicate Operand

Defines an operand of a predicate of a query to be executed against the layer.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: { "operator": "equals", arguments: [
    {
        <a href="#operand-layer-query-predicate-operand">"operand"</a>: "attribute",
        <a href="#name-layer-query-predicate-operand"   >"name"</a>:    "FISH_SPECIES"
    },
    {
        <a href="#operand-layer-query-predicate-operand">"operand"</a>: "parameter",
        <a href="#id-layer-query-predicate-operand"     >"id"</a>:      "species"
    }
] } } ] } ] } ] }
</pre>

### `operand` (Layer Query Predicate Operand)
`"operand"`: *String* *(REQUIRED)*  
If the operand is `"attribute"`, the [name](#name-layer-query-predicate-operand) property is the name of an attribute for the layer.

If the operand is `"parameter"`, the [id](#id-layer-query-predicate-operand) property is the id of a parameter defined in this query.

### `name` (Layer Query Predicate Operand)
`"name"`: *String* *(REQUIRED)*  
The name of an attribute for this layer.

### `id` (Layer Query Predicate Operand)
`"id"`: *String* *(REQUIRED)*  
The id of a parameter defined in this query.




## ESRI Dynamic Layer

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
    <a href="#queries-layer"      >"queries"</a>:       [ ... ],
    <a href="#mpcmid-esri-dynamic-layer"       >"mpcmId"</a>:        123,
    <a href="#mpcmworkspace-esri-dynamic-layer">"mpcmWorkspace"</a>: "MPCM_ALL_PUB",
    <a href="#serviceurl-esri-dynamic-layer"   >"serviceUrl"</a>:    "https://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer",
    <a href="#dynamiclayers-esri-dynamic-layer">"dynamicLayers"</a>: [ ... ],
} ] }
</pre>

### `mpcmId` (ESRI Dynamic Layer)
`"mpcmId"`: *String* *(REQUIRED)*  
The ID used for this layer in the DataBC Layer Catalog.

### `mpcmWorkspace` (ESRI Dynamic Layer)
`"mpcmWorkspace"`: *String* *(REQUIRED)*  
The workspace used for this layer in the DataBC Layer Catalog.

### `serviceUrl` (ESRI Dynamic Layer)
`"serviceUrl"`: *String* *(REQUIRED)*  
The URL for the DataBC Layer Catalog.

### `dynamicLayers` (ESRI Dynamic Layer)
`"dynamicLayers"`: *Array[String]* *(REQUIRED)*  
A listing of dynamic layer configurations. 
This will typically only contain one dynamic feature, which can be derived from the MPCM Layer Catalog.




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




## Style Definition

The style definition object.

<pre>
style: {
    <a href="#strokewidth-style-definition"  >"strokeWidth"</a>:   2,
    <a href="#strokestyle-style-definition"  >"strokeStyle"</a>:   "solid",
    <a href="#strokecolor-style-definition"  >"strokeColor"</a>:   "red",
    <a href="#strokeopacity-style-definition">"strokeOpacity"</a>: 0.75,
    <a href="#fillcolor-style-definition"    >"fillColor"</a>:     "#3a8f74"
    <a href="#fillopacity-style-definition"  >"fillOpacity"</a>:   0.4,
    <a href="#markerurl-style-definition"    >"markerUrl"</a>:     "foo.com/marker.png", 
    <a href="#markersize-style-definition"   >"markerSize"</a>:    [ 30, 20 ],
    <a href="#markeroffset-style-definition" >"markerOffset"</a>:  [ 15, 10 ]  
}
</pre>

### `strokeWidth` (Style Definition)
`"strokeWidth"`: *Number* *(OPTIONAL)*  
Width of a line or polygon outline.

### `strokeStyle` (Style Definition)
`"strokeStyle"`: *String* *(OPTIONAL)*  
Display style for a line or polygon outline (solid, dashed, dotted).

### `strokeColor` (Style Definition)
`"strokeColor"`: *String* *(OPTIONAL)*  
The CSS-style color code for the line or polygon outline.

### `strokeOpacity` (Style Definition)
`"strokeOpacity"`: *Number* *(OPTIONAL)*  
The opacity of the line or polygon outline.

### `fillColor` (Style Definition)
`"fillColor"`: *String* *(OPTIONAL)*  
The CSS-style color code for the polygon fill.

### `fillOpacity` (Style Definition)
`"fillOpacity"`: *Number* *(OPTIONAL)*  
The opacity for the polygon fill.

### `markerUrl` (Style Definition)
`"markerUrl"`: *String* *(OPTIONAL)*  
The URL or attachment ID to use for custom point marker symbols.
The attachment ID is prefixed with `@`.

### `markerSize` (Style Definition)
`"markerSize"`: *Array[Integer]* *(OPTIONAL)*  
The size of the marker image, as array [ *`[WIDTH]`*, *`[HEIGHT]`* ].

### `markerOffset` (Style Definition)
`"markerOffset"`: *Array[Integer]* *(OPTIONAL)*  
The offset of the marker image from the origin, as array [ *`[OFFSET-X]`*, *`[OFFSET-Y]`* ].



## Layer Display Definition

The layer display defines how the layers configured for the map are organized when shown in the [`"layers"`](#layers-tool) tool).
This configuration allows layers to be organized into folders, which can be nested arbitrarily.
Layers can also be put together into groups, which behave as a single layer, and don't expose their internal structure to user.
This configuration will also control the order in which layers are painted on the map, the top-most layer in this configuration is drawn on top of all other layers.

There are 3 types of objects that make up the layer display definition:

- [Display Layer](#display-layer)
- [Display Folder](#display-folder)
- [Display Group](#display-group)


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


## Display Folder

<pre>
{
    <a href="#id-display-folder"        >"id"</a>:         "folder1",
    <a href="#type-display-folder"      >"type"</a>:       "folder",
    <a href="#title-display-folder"     >"title"</a>:      "Folder 1",
    <a href="#isvisible-display-folder" >"isVisible"</a>:  true,
    <a href="#isexpanded-display-folder">"isExpanded"</a>: false,
    <a href="#items-display-folder"     >"items"</a>:      [ ... ],
}
</pre>

### `id` (Display Folder)
`"id"`: *String* *(OPTIONAL)*  
The id of the folder, which must be unique.

### `type` (Display Folder)
`"type"`: *String* *(REQUIRED)*  
The type must be `"folder"`.

### `title` (Display Folder)
`"title"`: *String* *(REQUIRED)*  
The title to show for the folder. 

### `isVisible` (Display Folder)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
If the folder is to be visible initially.
Default is `true`.

### `isExpanded` (Display Folder)
`"isExpanded"`: *Boolean* *(OPTIONAL)*  
If the folder is to be expanded initially
Default is `false`.

### `items` (Display Folder)
`"items"`: *Array[Object]* *(REQUIRED)*  
The [layer display objects](#layer-display-definition) that are contained in the folder.


## Display Group

<pre>
{
    <a href="#id-display-group"        >"id"</a>:         "group1",
    <a href="#type-display-group"      >"type"</a>:       "group",
    <a href="#title-display-group"     >"title"</a>:      "Group 1",
    <a href="#isvisible-display-group" >"isVisible"</a>:  true,
    <a href="#items-display-group"     >"items"</a>:      [ ... ],
}
</pre>

### `id` (Display Group)
`"id"`: *String* *(OPTIONAL)*  
The id of the group, which must be unique.

### `type` (Display Group)
`"type"`: *String* *(REQUIRED)*  
The type must be `"group"`.

### `title` (Display Group)
`"title"`: *String* *(REQUIRED)*  
The title to show for the group. 

### `isVisible` (Display Group)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
If the group is to be visible initially.
Default is `true`.

### `items` (Display Group)
`"items"`: *Array[Object]* *(REQUIRED)*  
The [layer display objects](#layer-display-definition) that are contained in the group.
