## Layer Query Predicate AND Operator

The query predicate holds if **ALL** of it's arguments hold.
There must be at least one argument.
The arguments are [layer query predicate](#layer-query-predicate) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "and",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

