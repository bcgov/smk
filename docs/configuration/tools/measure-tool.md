# Measure Tool

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

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}
