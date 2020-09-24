## Select Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user picking a value from a drop-down list.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"            >"id"</a>:      "species-name",
    <a href="#title-layer-query-parameter"         >"title"</a>:   "Species Name or Code",
    <a href="#value-layer-query-parameter"         >"value"</a>:   "salmon",
    <a href="#type-layer-query-parameter"          >"type"</a>:    "select",
    <a href="#choices-select-layer-query-parameter">"choices"</a>: [ ... ]
} ] } ] } ] }
</pre>

### `choices` (Select Layer Query Parameter)
`"choices"`: *Array[Object]* *(REQUIRED)*  
An array of `{ title, value }` objects to populate a drop-down list.
The `title` is optional.

