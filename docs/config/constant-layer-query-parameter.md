## Constant Layer Query Parameter

Use a constant parameter to provide a constant value to the [query predicate](#layer-query-predicate).
If the [title](#title-layer-query-parameter) is configured, then the constant is shown in query form, otherwise it is hidden.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"         >"id"</a>:    "species-name",
    <a href="#value-layer-query-parameter"      >"value"</a>: "salmon",
    <a href="#type-layer-query-parameter"       >"type"</a>:  "constant"
} ] } ] } ] }
</pre>

