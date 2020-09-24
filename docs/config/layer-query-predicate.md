## Layer Query Predicate

Defines the query to be executed against the layer.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate" >"operator"</a>:  "or",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

### `operator` (Layer Query Predicate)
`"operator"`: *String* *(REQUIRED)*  
The operation to apply to the arguments.
One of these options:
[`"and"`](#layer-query-predicate-and-operator),
[`"or"`](#layer-query-predicate-or-operator),
[`"not"`](#layer-query-predicate-not-operator),
[`"equals"`](#layer-query-predicate-equals-operator),
[`"less-than"`](#layer-query-predicate-less-than-operator),
[`"greater-than"`](#layer-query-predicate-greater-than-operator),
[`"contains"`](#layer-query-predicate-contains-operator),
[`"starts-with"`](#layer-query-predicate-starts-with-operator),
or
[`"ends-with"`](#ends-with-operator-layer-query-predicate).

