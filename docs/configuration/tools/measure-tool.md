## Measure Tool

Add a button to the toolbar, that shows a panel that allows the user to measure distances or areas on the map.

This is default configuration for the Measure tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:     "measure",
    <a href="#title-property"    >"title"</a>:    "Measurement",
    <a href="#showtitle-property">"showTitle"</a>:false,
    <a href="#enabled-property"  >"enabled"</a>:  false,
    <a href="#icon-property"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"straighten"</a>,
    <a href="#order-property"    >"order"</a>:    6,
    <a href="#position-property" >"position"</a>: [ "shortcut-menu", "list-menu", "toolbar" ],
} ] }
</pre>

{% include_relative include/tool-base-type.md %}
{% include_relative include/tool-base-title.md %}
{% include_relative include/tool-base-show-title.md %}
{% include_relative include/tool-base-enabled.md %}
{% include_relative include/tool-base-icon.md %}
{% include_relative include/tool-base-order.md %}
{% include_relative include/tool-base-position.md %}
