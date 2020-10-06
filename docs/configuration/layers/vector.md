###### [SMK](../..) / [Configuration](..) / [Layers](.)

# Vector Layer

This is default configuration for the Vector layer.
Click on a property name for more information:
<pre>
{ "layers": [ {
    <a href="#type-property"                >"type"</a>:                "vector",
    <a href="#id-property"                  >"id"</a>:                  null,
    <a href="#title-property"               >"title"</a>:               null,
    <a href="#opacity-property"             >"opacity"</a>:             null,
    <a href="#isvisible-property"           >"isVisible"</a>:           false,
    <a href="#isqueryable-property"         >"isQueryable"</a>:         true,
    <a href="#minscale-property"            >"minScale"</a>:            null,
    <a href="#maxscale-property"            >"maxScale"</a>:            null,
    <a href="#metadataurl-property"         >"metadataUrl"</a>:         null,
    <a href="#popuptemplate-property"       >"popupTemplate"</a>:       null,
    <a href="#titleattribute-property"      >"titleAttribute"</a>:      null,
    <a href="#attributes-property"          >"attributes"</a>:          null,
    <a href="#queries-property"             >"queries"</a>:             null,
    <a href="#useclustering-property"       >"useClustering"</a>:       false,
    <a href="#useheatmap-property"          >"useHeatmap"</a>:          false,
    <a href="#style-property"               >"style"</a>:               null,
    <a href="#dataUrl-property"             >"dataUrl"</a>:             null
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/id-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/opacity-property.md %}
{% include_relative include/is-visible-property.md %}
{% include_relative include/is-queryable-property.md %}
{% include_relative include/min-scale-property.md %}
{% include_relative include/max-scale-property.md %}
{% include_relative include/metadata-url-property.md %}
{% include_relative include/popup-template-property.md %}
{% include_relative include/title-attribute-property.md %}
{% include_relative include/attributes-property.md %}
{% include_relative include/queries-property.md %}


## UseClustering Property
`"useClustering": Boolean`

If `true`, the layer should use point clustering.
Only relevant for point geometry layers.
The default is `false`.


## UseHeatmap Property
`"useHeatmap": Boolean`

If `true`, the layer should use heatmap clustering.
Only relevant for point geometry layers.
The default is `false`.


## Style Property
`"style": Object | Array`

The [style object](style) used to render the features from this data source.


## DataUrl Property
`"dataUrl": String`

The URL that points to a GeoJSON data source.




