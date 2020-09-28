## List Menu Tool

If this tool is enabled, then `"list-menu"` can be used a position for other tools.
This tool adds a button to the toolbar where it is positioned, which opens a panel containing a list of the tools it contains.

This is default configuration for the List Menu tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:     "list-menu",
    <a href="#title-property"    >"title"</a>:    null,
    <a href="#showtitle-property">"showTitle"</a>:false,
    <a href="#enabled-property"  >"enabled"</a>:  false,
    <a href="#icon-property"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"menu"</a>,
    <a href="#order-property"    >"order"</a>:    1,
    <a href="#position-property" >"position"</a>: "toolbar",
} ] }
</pre>

{% include_relative include/tool-base-type.md %}
{% include_relative include/tool-base-title.md %}
{% include_relative include/tool-base-show-title.md %}
{% include_relative include/tool-base-enabled.md %}
{% include_relative include/tool-base-icon.md %}
{% include_relative include/tool-base-order.md %}
{% include_relative include/tool-base-position.md %}
