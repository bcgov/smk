# About Tool

Add a button to the toolbar, that shows a panel with content that is taken from the configuration.
It is typically used show a panel of information about the application.

This is default configuration for the About tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:     "about",
    <a href="#title-property"    >"title"</a>:    "About SMK",
    <a href="#showtitle-property">"showTitle"</a>:false,
    <a href="#enabled-property"  >"enabled"</a>:  false,
    <a href="#icon-property"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"help"</a>,
    <a href="#order-property"    >"order"</a>:    1,
    <a href="#position-property" >"position"</a>: "list-menu",
    <a href="#content-property"  >"content"</a>:  null
} ] }
</pre>

{% include_relative include/tool-type.md %}
{% include_relative include/tool-title.md %}
{% include_relative include/tool-show-title.md %}
{% include_relative include/tool-enabled.md %}
{% include_relative include/tool-icon.md %}
{% include_relative include/tool-order.md %}
{% include_relative include/tool-position.md %}

## Content Property
`"content"`: `String`

The content to show in the panel.
This is assumed to be formatted in HTML.
Any styling should be inline in the HTML, or refer to classes that are defined by the enclosing application.

