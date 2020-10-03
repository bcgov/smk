{% include_relative include/breadcrumbs.md %}

# Version Tool

Add a button to the toolbar, that shows a panel containing the version of SMK, and build information.
This is for debugging purposes.

This is default configuration for the Version tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:     "version",
    <a href="#title-property"    >"title"</a>:    "Version Info",
    <a href="#showtitle-property">"showTitle"</a>:false,
    <a href="#enabled-property"  >"enabled"</a>:  false,
    <a href="#icon-property"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"build"</a>,
    <a href="#order-property"    >"order"</a>:    99,
    <a href="#position-property" >"position"</a>: [ "list-menu", "toolbar" ],
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}
