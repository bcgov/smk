###### [SMK](../../../..) / [Configuration](../../..) / [Layers](../..) / [Query](..) / [Parameter](.)

# Select Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](../predicate) that comes from the user picking a value from a drop-down list.

A parameter object is defined with these properties.
Click on a property name for more information:
<pre>
{
    <a href="#type-property"    >"type"</a>:    "input",
    <a href="#id-property"      >"id"</a>:      null,
    <a href="#title-property"   >"title"</a>:   null,
    <a href="#value-property"   >"value"</a>:   null,
    <a href="#choices-property" >"choices"</a>: null
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
