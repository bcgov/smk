## Layer Query Predicate OR Operator

The query predicate holds if **AT LEAST ONE** of it's arguments hold.
There must be at least one argument.
The argument are [layer query predicate](#layer-query-predicate) objects.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", predicate: {
    <a href="#operator-layer-query-predicate"   >"operator"</a>:  "or",
    "arguments": [ ... ],
} ] } ] } ] }
</pre>

