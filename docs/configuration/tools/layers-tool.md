## Layers Tool

Add a button to the toolbar, that shows a panel that lists all the layers configured for the map.
It allows the user to hide or show any layer, and to see the layer legend.
Use the [display property](#display-property) to organize the layers into folders and groups.

This is default configuration for the Layers tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:      "layers",
    <a href="#title-property"    >"title"</a>:     "Layers",
    <a href="#showtitle-property">"showTitle"</a>: false,
    <a href="#enabled-property"  >"enabled"</a>:   false,
    <a href="#icon-property"     >"icon"</a>:      <a href="https://material.io/tools/icons/?icon=help" target="material">"layers"</a>,
    <a href="#order-property"    >"order"</a>:     3,
    <a href="#position-property" >"position"</a>:  [ "shortcut-emnu", "list-menu", "toolbar" ],
    <a href="#command-property"  >"command"</a>:   {
        <a href="#allVisibility-sub-property"   >"allVisibility"</a>:   true,
        <a href="#filter-sub-property"          >"filter"</a>:          true,
        <a href="#legend-sub-property"          >"legend"</a>:          true
    },
    <a href="#glyph-property"  >"glyph"</a>:   {
        <a href="#visible-sub-property"         >"visible"</a>:         "visibility",
        <a href="#hidden-sub-property"          >"hidden"</a>:          "visibility_off"
    },
    <a href="#display-property"  >"display"</a>:  [ ... ]
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}

## Command Property
`"command"`: `Object`

Determines which controls are visible on the panels for this tool.


### AllVisibility Sub-Property
`"command"`: `{ "allVisibility": Boolean }`

If `true`, shows the visibility control that toggles the state of all layers.


### Filter Sub-Property
`"command"`: `{ "filter": Boolean }`

If `true`, shows the text entry field for filtering the layer list.


### Legend Sub-Property
`"command"`: `{ "legend": Boolean }`

If `true`, shows a toggle that determines if a layer's legend is displayed alongside the layer in the list.


## Glyph Property
`"glyph"`: `Object`

The icons used for elements in the layer list.


### Visible Sub-Property
`"glyph"`: `{ "visible": String }`

The name of the icon representing a layer that the user wants to be visible.


### Hidden Sub-Property
`"glyph"`: `{ "hidden": String }`

The name of the icon representing a layer that the user wants to be hidden.


## Display Property
`"display"`: `Array`

An array of Display objects (either [DisplayLayer](layers-tool-display#displaylayer-object), [DisplayFolder](layers-tool-display#displayfolder-object), or [DisplayGroup](layers-tool-display#displaygroup-object)) that determines how the layers defined in the `"layers"` section of the configuration are to be organized in the layers panel.
A Display object either represents a layer ([DisplayLayer](layers-tool-display#displaylayer-object)) or it represents a collection of Display objects ([DisplayFolder](layers-tool-display#displayfolder-object) or [DisplayGroup](layers-tool-display#displaygroup-object)).

