## Search Tool

Add a search input field to the toolbar.
The text entered in the input field is used to perform a location search.
The results are marked on the map, and displayed in a panel.

This is default configuration for the Search tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:         "search",
    <a href="#title-property"    >"title"</a>:        "Search for Location",
    <a href="#showtitle-property">"showTitle"</a>:    false,
    <a href="#showpanel-property">"showPanel"</a>:    true,
    <a href="#showlocation-property">"showLocation"</a>: true,
    <a href="#enabled-property"  >"enabled"</a>:      true,
    <a href="#icon-property"     >"icon"</a>:         <a href="https://material.io/tools/icons/?icon=help" target="material">"search"</a>,
    <a href="#order-property"    >"order"</a>:        2,
    <a href="#position-property" >"position"</a>:     "toolbar",
    <a href="#command-property"  >"command"</a>: {
        <a href="#identify-sub-property"    >"identify"</a>:   true,
        <a href="#measure-sub-property"     >"measure"</a>:    true,
        <a href="#directions-sub-property"  >"directions"</a>: true
    }
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/show-panel-property.md %}


## ShowLocation Property
`"showLocation"`: `Boolean`

If `true`, then the selected search result will be shown as a [location panel](location-tool).


{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}

## Command Property
`"command"`: `Object`

Determines which controls are visible on the panels for this tool.

### Identify Sub-Property
`"command"`: `{ "identify": Boolean }`

If `true`, shows a button to do identify at the current search result.

### Measure Sub-Property
`"command"`: `{ "measure": Boolean }`

If `true`, shows a button to start a measurement at the current search result.

### Directions Sub-Property
`"command"`: `{ "directions": Boolean }`

If `true`, shows a button to start a route plan at the current search result.

