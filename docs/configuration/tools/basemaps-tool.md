## BaseMaps Tool

Add a button to the toolbar, that shows a panel which lets the user choose which base map they want the map to use.
[This is the list](#basemap-viewer) of base maps to choose from.
If there is a need to restrict the set of base maps the user can choose from, then set the choices property.

This is default configuration for the BaseMaps tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:     "baseMaps",
    <a href="#title-property"    >"title"</a>:    "Base Maps",
    <a href="#showtitle-property">"showTitle"</a>:false,
    <a href="#enabled-property"  >"enabled"</a>:  false,
    <a href="#icon-property"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"map"</a>,
    <a href="#order-property"    >"order"</a>:    3,
    <a href="#position-property" >"position"</a>: [ "shortcut-menu", "list-menu", "toolbar" ],
    <a href="#mapStyle-property" >"mapStyle"</a>: { width: '110px', height: '110px' },
    <a href="#choices-property"  >"choices"</a>:  null,
} ] }
</pre>

{% include_relative include/tool-base-type.md %}
{% include_relative include/tool-base-title.md %}
{% include_relative include/tool-base-show-title.md %}
{% include_relative include/tool-base-enabled.md %}
{% include_relative include/tool-base-icon.md %}
{% include_relative include/tool-base-order.md %}
{% include_relative include/tool-base-position.md %}


### MapStyle Property
`"mapStyle"`: `Object`

This is an object containing CSS properties, which is used to style the map sample tiles in the base map chooser panel.


### Choices Property
`"choices"`: `Array`

The list of base maps to let the user choose from.
The names are taken from [this list](#basemap-viewer).

