## Input Layer Query Parameter

Use an input parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user entering into an input field.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#title-layer-query-parameter"      >"title"</a>: "Species Name or Code",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "input"
} ] } ] } ] }
</pre>

