###### [SMK](../../../..) / [Configuration](../../..) / [Layers](../..) / [Query](..) / [Parameter](.)

# Select Unique Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](../predicate) that comes from the user picking a value from a drop-down list.
The drop-down list is populated dynamically from the layer by finding all unique values for [`"uniqueAttribute"` property](#uniqueattribute-property).
If the request to populate the drop-down fails, the drop-down field changes to an input field.
The [`"choices"` property](#choices-property) may be used as well to provide a fall-back.

##### Note

**DO NOT** use this parameter type if you know the number of unique values will be more than a few hundred.

A parameter object is defined with these properties.
Click on a property name for more information:
<pre>
{
    <a href="#type-property"            >"type"</a>:            "select-unique",
    <a href="#id-property"              >"id"</a>:              null,
    <a href="#title-property"           >"title"</a>:           null,
    <a href="#value-property"           >"value"</a>:           null,
    <a href="#choices-property"         >"choices"</a>:         null,
    <a href="#uniqueattribute-property" >"uniqueAttribute"</a>: null
}
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/id-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/value-property.md %}

## Choices Property
`"choices": Array`

An array of `{ title, value }` objects to populate a drop-down list.
The `title` is optional.


## UniqueAttribute Property
`"uniqueAttribute": String`

The name of the attribute on the layer that will be queried to find all unique values.

