###### [SMK](../../..) / [Configuration](../..) / [Layers](..)

# Layer Query Object

This object defines a query template for a layer.
This query object must associated with an instance of the [`"query"` tool](../../tools/query), which will gather the values of parameters (if any) from the user, run the query, and then display the results.

The [`"id"` property](#id-property) must be unique within the layer, and is used to construct the [`"instance"` property](../../tools/query#instance-property) for the `"query"` tool.

Any parameters required for the query are defined in the [`"parameters"` property](#parameters-property). Any constant values that the query needs are defined here too.

The parameters are refered to as arguments of predicate objects that are defined in the [`"predicate"` property](#predicate-property).

A query object is defined with these properties.
Click on a property name for more information:
<pre>
{
    <a href="#id-property"          >"id"</a>:          null,
    <a href="#title-property"       >"title"</a>:       null,
    <a href="#description-property" >"description"</a>: null,
    <a href="#parameters-property"  >"parameters"</a>:  null,
    <a href="#predicate-property"   >"predicate"</a>:   null
}
</pre>

## Id Property
`"id": String`

The unique identifier for the query.
This **MUST** be unique within the layer query list.
Conventionally it is all lowercase with `-` separating words.


## Title Property
`"title": String`

The title for the query, that will be uses for the [`"query"` tool](../../tools/query).


## Description Property
`"description": String`

A longer description of the query, that is shown on the panel above the query parameter form.


## Parameters Property
`"parameters": Array`

An array of [layer query parameter objects](parameter).
Used to define the parameters that the user must provide the query.


## Predicate Property
`"predicate": Object`

A [layer query predicate object](predicate).
Used to define the query that is to be executed against the layer.
