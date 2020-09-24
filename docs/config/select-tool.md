## Select Tool

Add a button to the toolbar, that shows a panel containing the current selection set.
When this tool is enabled, the [`"identify"`](#identify-tool) tool has an additional action available for features.
The feature can be copied to the selection, so it appears in this panel.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "baseMaps",
    <a href="#title-tool"       >"title"</a>:    "Base Maps",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=map" target="material">"map"</a>,
    <a href="#order-tool"       >"order"</a>:    3,
    <a href="#position-tool"    >"position"</a>: "menu",
    <a href="#style-select-tool">"style"</a>:    { ... }
} ] }
</pre>

### `style` (Select Tool)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the feature markers.
The object is a [style definition](#style-definition).

