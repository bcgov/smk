## Query Tool

Add a button to the toolbar, that shows a panel containing an input form.
When user fills out the form and clicks the 'Search' button, a query is performed on a layer, and the results are shown at bottom of the panel, as well as on the map.

The [queries](#queries-layer) are defined on layer objects, this tool needs to know which query to use.
The [instance](#instance-query-tool) property must contain the id of the [query object](#layer-query) (which is associated with a layer).

This tool is the only one that can appear multiple times in the map configuration, but each one must have a different [instance](#instance-query-tool) value.

The title of the panel and tool button come from the query.
The [icon](#icon-tool), [order](#order-tool), and [position](#position-tool) can be different for each [instance](#instance-query-tool) value.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "query",
    <a href="#enabled-tool"     >"enabled"</a>:  false,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=question_answer" target="material">"question_answer"</a>,
    <a href="#order-tool"       >"order"</a>:    4,
    <a href="#position-tool"    >"position"</a>: "toolbar",
    <a href="#instance-query-tool"  >"instance"</a>: null,
    <a href="#style-query-tool"     >"style"</a>:    { ... }
} ] }
</pre>

### `instance` (Query Tool)
`"instance"`: *String* *(REQUIRED)*  
This must be the id of a query object.

### `style` (Query Tool)
`"style"`: *Object* *(OPTIONAL)*  
The style used to render the feature markers.
The object is a [style definition](#style-definition).

