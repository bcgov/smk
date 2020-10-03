###### [SMK](../..) / [Configuration](..) / [Layers](.)

# Layer Style Objects

This object defines the styling for a [`"vector"` layer](vector).
The [`"style"` property](vector#style-property) can contain one of these objects or an array of many of these objects.
When multiple styles are defined, then each feature in the layer is rendered in each style successively. This is a way to build more complex styles.

If a point feature is being rendered, the `"marker..."` properties are used. If the [`"markerUrl"` property](#markerurl-property) isn't defined, then a circle is rendered instead, using the `"stroke..."` and `"fill..."` properties. The circle radius will be half of the [`"strokeWidth"` property](#strokewidth-property).

A style object contains is defined with these properties, which have these default values.
Click on a property name for more information:
<pre>
{
    <a href="#stroke-property"          >"stroke"</a>:          true,
    <a href="#strokecolor-property"     >"strokeColor"</a>:     "#3388ff",
    <a href="#strokewidth-property"     >"strokeWidth"</a>:     3,
    <a href="#strokeopacity-property"   >"strokeOpacity"</a>:   1,
    <a href="#strokecap-property"       >"strokeCap"</a>:       "round",
    <a href="#strokejoin-property"      >"strokeJoin"</a>:      "round",
    <a href="#strokedashes-property"    >"strokeDashes"</a>:    null,
    <a href="#strokedashoffset-property">"strokeDashOffset"</a>:null,

    <a href="#fill-property"            >"fill"</a>:            false,
    <a href="#fillcolor-property"       >"fillColor"</a>:       "#3388ff",
    <a href="#fillopacity-property"     >"fillOpacity"</a>:     0.2,

    <a href="#markerurl-property"       >"markerUrl"</a>:       null,
    <a href="#markersize-property"      >"markerSize"</a>:      null,
    <a href="#markeroffset-property"    >"markerOffset"</a>:    null
    <a href="#shadowurl-property"       >"shadowUrl"</a>:       null,
    <a href="#shadowsize-property"      >"shadowSize"</a>:      null,
}
</pre>


## Stroke Property
`"stroke": Boolean`

If `true`, then the line or border of the feature is styled according to the `"stroke..."` properties.
The default value is `true`.


## StrokeColor Property
`"strokecolor": String`

The CSS-style color code for the line or polygon outline.


## StrokeWidth Property
`"strokewidth": Number`

Width of a line or polygon outline in pixels.


## StrokeOpacity Property
`"strokeopacity": Number`

The opacity of the line or polygon outline.
The value is in range from 0 (transparent) to 1 (opaque).


## StrokeCap Property
`"strokecap": String`

The shape of the end cap on a line segment.
Can be one of: `"butt"`, `"round"`, or `"square"`.


## StrokeJoin Property
`"strokejoin": String`

The shape of the join between two line segments.
Can be one of: `"miter"`, `"round"`, or `"bevel"`.


## StrokeDashes Property
`"strokedashes": String`

A list of white space separated segment lengths that specify the size of alternating dashes and gaps.


## StrokeDashOffset Property
`"strokedashOffset": Number`

An offset on the beginning of the associated dash array.


## Fill Property
`"fill": Boolean`

If `true`, then the interior of the feature is styled according to the `"fill..."` properties.
The default value is `false`.


## FillColor Property
`"fillcolor": String`

The CSS-style color code to use filling the polygon feature.


## FillOpacity Property
`"fillopacity": Number`

The opacity of the polygon fill.
The value is in range from 0 (transparent) to 1 (opaque).


## MarkerUrl Property
`"markerurl": String`

The URL to use for custom point marker symbol.


## MarkerSize Property
`"markersize": Array`

The size of the marker image, as an array [ *width*, *height* ].


## MarkerOffset Property
`"markeroffset": Array`

The offset of the marker image from the origin, as an array [ *left*, *top* ].


## ShadowUrl Property
`"shadowurl": String`

The URL to use for custom point marker shadow.


## ShadowSize Property
`"shadowsize": Array`

The size of the shadow image, as an array [ *width*, *height* ].
