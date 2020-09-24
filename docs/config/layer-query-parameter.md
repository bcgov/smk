## Layer Query Parameter

Configures a parameter that will be used by the [query predicate](#layer-query-predicate).

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#title-layer-query-parameter"      >"title"</a>: "Species Name or Code",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "input"
} ] } ] } ] }
</pre>

### `id` (Layer Query Parameter)
`"id"`: *String* *(REQUIRED)*  
The unique identifier for the parameter.
This **MUST** be unique within the layer query parameter list.
Conventionally it is all lowercase with `-` separating words.

### `title` (Layer Query Parameter)
`"title"`: *String* *(REQUIRED)*  
The title to show in query form for this parameter.

### `value` (Layer Query Parameter)
`"value"`: *String* *(OPTIONAL)*  
The default value for the parameter.
If not provided, the user **MUST** provide a value to execute the query.

### `type` (Layer Query Parameter)
`"type"`: *String* *(REQUIRED)*  
The type of form entry field to use.
One of these options:
[`"constant"`](#constant-layer-query-parameter),
[`"input"`](#input-layer-query-parameter),
[`"select"`](#select-layer-query-parameter),
or
[`"select-unique"`](#select-unique-layer-query-parameter).

