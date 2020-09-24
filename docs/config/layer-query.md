## Layer Query

<pre>
{ "layers": [ { "id": "fish-points", queries: [ {
    <a href="#id-layer-query"         >"id"</a>:          "species",
    <a href="#title-layer-query"      >"title"</a>:       "Find by species",
    <a href="#description-layer-query">"description"</a>: "Find fish points that match by species code or name.",
    <a href="#parameters-layer-query" >"parameters"</a>:  [ ... ],
    <a href="#predicate-layer-query"  >"predicate"</a>:   { ... }
} ] } ] }
</pre>

### `id` (Layer Query)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the query.
This **MUST** be unique within the layer query list.
Conventionally it is all lowercase with `-` separating words.

### `title` (Layer Query)
`"title"`: *String* *(REQUIRED)*  
The title for the query, that will be uses for the [`"query"`](#query-tool) tool button.

### `description` (Layer Query)
`"description"`: *String* *(REQUIRED)*  
A longer description of the query, that is shown on the panel above the query parameter form.

### `parameters` (Layer Query)
`"parameters"`: *Array[Object]* *(REQUIRED)*  
An array of [layer query parameter objects](#layer-query-parameter).
Used to define the parameters that the user must provide the query.

### `predicate` (Layer Query)
`"predicate"`: *Object* *(REQUIRED)*  
A [layer query predicate object](#layer-query-predicate).
Used to define the query that is to be executed against the layer.

