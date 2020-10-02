###### [SMK](../..) / [Configuration](..) / [Layers](.)

# Layer Attribute Objects

This object defines the appearance of an attribute from a layer's dataset, when it appears in the details of a feature in the [`"identify"` tool](../tools/identify-tool), [`"query"` tool](../tools/query-tool), or [`"select"` tool](../tools/select-tool).

The `"attributes"` property of a layer, will have list of these objects.
This determines the order the attributes will appear in the feature detail panel.

This object is to be defined for each attribute, with the default values.
Click on a property name for more information:
<pre>
{
    <a href="#id-layer-attribute"     >"id"</a>:      null,
    <a href="#name-layer-attribute"   >"name"</a>:    null,
    <a href="#title-layer-attribute"  >"title"</a>:   null,
    <a href="#visible-layer-attribute">"visible"</a>: true
}
</pre>

## Id Property
`"id": String`

The unique identifier for the layer attribute.
This **MUST** be unique within the layer attribute list.
Conventionally it is all lowercase with `-` separating words.


## Name Property
`"name": String`

The internal name of the attribute in the layer's dataset.
This must match an attribute name in the feature.


## Title Property
`"title": String`

The title for the attribute to show the feature panel.


## Visible Property
`"visible": Boolean`

If `true`, the attribute is visible in the feature panel.
The default is `true`.
