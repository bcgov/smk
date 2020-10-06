## Arguments Property
`"arguments": Array`

Defines the arguments for a predicate that takes exactly 2 operands.

The arguments have 2 possible types. The first type is an `"attribute"` operand, where the `"name"` property is the name of an attribute in the layer. This attribute will be used as part of the predicate expresion.

<pre>
{
    "operand": "attribute",
    "name":    "..."
}
</pre>

The second type is an `"parameter"` operand, where the `"id"` property is the id from the [`"parameters"` property](../parameter). This parameter will be used as part of the predicate expression.

<pre>
{
    "operand": "parameter",
    "id":      "..."
}
</pre>
