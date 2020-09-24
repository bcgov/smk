## Style Definition

The style definition object.

<pre>
style: {
    <a href="#strokewidth-style-definition"  >"strokeWidth"</a>:   2,
    <a href="#strokestyle-style-definition"  >"strokeStyle"</a>:   "solid",
    <a href="#strokecolor-style-definition"  >"strokeColor"</a>:   "red",
    <a href="#strokeopacity-style-definition">"strokeOpacity"</a>: 0.75,
    <a href="#fillcolor-style-definition"    >"fillColor"</a>:     "#3a8f74"
    <a href="#fillopacity-style-definition"  >"fillOpacity"</a>:   0.4,
    <a href="#markerurl-style-definition"    >"markerUrl"</a>:     "foo.com/marker.png", 
    <a href="#markersize-style-definition"   >"markerSize"</a>:    [ 30, 20 ],
    <a href="#markeroffset-style-definition" >"markerOffset"</a>:  [ 15, 10 ]  
}
</pre>

### `strokeWidth` (Style Definition)
`"strokeWidth"`: *Number* *(OPTIONAL)*  
Width of a line or polygon outline.

### `strokeStyle` (Style Definition)
`"strokeStyle"`: *String* *(OPTIONAL)*  
Display style for a line or polygon outline (solid, dashed, dotted).

### `strokeColor` (Style Definition)
`"strokeColor"`: *String* *(OPTIONAL)*  
The CSS-style color code for the line or polygon outline.

### `strokeOpacity` (Style Definition)
`"strokeOpacity"`: *Number* *(OPTIONAL)*  
The opacity of the line or polygon outline.

### `fillColor` (Style Definition)
`"fillColor"`: *String* *(OPTIONAL)*  
The CSS-style color code for the polygon fill.

### `fillOpacity` (Style Definition)
`"fillOpacity"`: *Number* *(OPTIONAL)*  
The opacity for the polygon fill.

### `markerUrl` (Style Definition)
`"markerUrl"`: *String* *(OPTIONAL)*  
The URL or attachment ID to use for custom point marker symbols.
The attachment ID is prefixed with `@`.

### `markerSize` (Style Definition)
`"markerSize"`: *Array[Integer]* *(OPTIONAL)*  
The size of the marker image, as array [ *`[WIDTH]`*, *`[HEIGHT]`* ].

### `markerOffset` (Style Definition)
`"markerOffset"`: *Array[Integer]* *(OPTIONAL)*  
The offset of the marker image from the origin, as array [ *`[OFFSET-X]`*, *`[OFFSET-Y]`* ].



