## Layer Query Predicate NOT Operator

The query predicate holds if it's argument fails.
There must be **EXACTLY** one argument.
The argument is a [layer query predicate](#layer-query-predicate) object.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "not",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

