{% include_relative include/breadcrumbs.md %}

# Zoom Tool

If this tool is enabled, then the user is able to change the zoom level of the map.

This is default configuration for the Zoom tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"        >"type"</a>:        "zoom",
    <a href="#enabled-property"     >"enabled"</a>:     false,
    <a href="#mousewheel-property"  >"mouseWheel"</a>:  true
    <a href="#doubleclick-property" >"doubleClick"</a>: true
    <a href="#box-property"         >"box"</a>:         true
    <a href="#control-property"     >"control"</a>:     true
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/enabled-property.md %}

## MouseWheel Property
`"mouseWheel"`: `Boolean`

If `true`, then the map can be zoomed with the mouse wheel.


## DoubleClick Property
`"doubleClick"`: `Boolean`

If `true`, then the map will zoom-in on a double-click.


## Box Property
`"box"`: `Boolean`

If `true`, then the user can hold the **SHIFT** key and drag a box on the map to zoom in.


## Control Property
`"control"`: `Boolean`

If `true`, then there are zoom-in, zoom-out buttons on the map.

