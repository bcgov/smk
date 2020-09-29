# Scale Tool

Adds a scale display to the bottom-right corner of the map.
This display shows the current scale, and a ruler showing the real ground distance.

This is default configuration for the Scale tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"        >"type"</a>:       "scale",
    <a href="#enabled-property"     >"enabled"</a>:    false,
    <a href="#showfactor-property"  >"showFactor"</a>: true
    <a href="#showbar-property"     >"showBar"</a>:    true
    <a href="#showzoom-property"    >"showZoom"</a>:   false
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/enabled-property.md %}

## ShowFactor Property
`"showFactor"`: `Boolean`

If `true`, then the scale display shows the scale factor.

## ShowBar Property
`"showBar"`: `Boolean`

If `true`, then the scale display shows the distance ruler.

## ShowZoom Property
`"showZoom"`: `Boolean`

If `true`, then the scale display shows the zoom level.
