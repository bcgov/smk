## Scale Tool

Adds a scale display to the bottom-right corner of the map.
This display shows the current scale, and a ruler showing the real ground distance.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:       "scale",
    <a href="#enabled-tool"     >"enabled"</a>:    false,
    <a href="#showfactor-scale-tool">"showFactor"</a>: true
    <a href="#showbar-scale-tool"   >"showBar"</a>:    true
} ] }
</pre>

### `showFactor` (Scale Tool)
`"showFactor"`: *Boolean* *(OPTIONAL)*  
If `true`, then the scale display shows the scale factor.

### `showBar` (Scale Tool)
`"showBar"`: *Boolean* *(OPTIONAL)*  
If `true`, then the scale display shows the distance ruler.

