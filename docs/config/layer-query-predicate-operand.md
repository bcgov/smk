## Layer Query Predicate Operand

Defines an operand of a predicate of a query to be executed against the layer.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: { "operator": "equals", arguments: [
    {
        <a href="#operand-layer-query-predicate-operand">"operand"</a>: "attribute",
        <a href="#name-layer-query-predicate-operand"   >"name"</a>:    "FISH_SPECIES"
    },
    {
        <a href="#operand-layer-query-predicate-operand">"operand"</a>: "parameter",
        <a href="#id-layer-query-predicate-operand"     >"id"</a>:      "species"
    }
] } } ] } ] } ] }
</pre>

### `operand` (Layer Query Predicate Operand)
`"operand"`: *String* *(REQUIRED)*  
If the operand is `"attribute"`, the [name](#name-layer-query-predicate-operand) property is the name of an attribute for the layer.

If the operand is `"parameter"`, the [id](#id-layer-query-predicate-operand) property is the id of a parameter defined in this query.

### `name` (Layer Query Predicate Operand)
`"name"`: *String* *(REQUIRED)*  
The name of an attribute for this layer.

### `id` (Layer Query Predicate Operand)
`"id"`: *String* *(REQUIRED)*  
The id of a parameter defined in this query.




