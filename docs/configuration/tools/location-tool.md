## Location Tool

If this tool is enabled, then clicking on the map will show a popup giving the clicked point's location.
If the [`"identify"`](identify-tool.html) or [`"directions"`](directions-tool.html) tools are enabled, then buttons are visible on this popup with additional actions.

This is default configuration for the Location tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"        >"type"</a>:        "location",
    <a href="#enabled-property"     >"enabled"</a>:     true,
    <a href="#showheader-property"  >"showHeader"</a>:  false
} ] }
</pre>

{% include_relative include/tool-type.md %}
{% include_relative include/tool-enabled.md %}
{% include_relative include/tool-show-header.md %}
