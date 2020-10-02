###### [SMK](../..) / [Configuration](..) / [Layers](.)

# WMS Layer

This is default configuration for the WMS layer.
Click on a property name for more information:
<pre>
{ "layers": [ {
    <a href="#type-property"                >"type"</a>:                "wms",
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
    <a href="#version-property"             >"version"</a>:             '1.1.1',
    <a href="#layername-property"           >"layerName"</a>:           null,
    <a href="#stylename-property"           >"styleName"</a>:           null,
    <a href="#serviceurl-property"          >"serviceUrl"</a>:          null,
    <a href="#geometryattribute-property"   >"geometryAttribute"</a>:   null
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

## Version Property
`"version": String`

The WMS version used for GetMap, GetFeatureInfo and GetCapabilities WMS requests.


## LayerName Property
`"layerName": String`

The name of the layer to use when making get map requests for the WMS layer.


## StyleName Property
`"styleName": String`

The name of the style to use when making get map requests for the WMS layer.


## ServiceUrl Property
`"serviceUrl": String`

The URL for the WMS service.


## GeometryAttribute Property
`"geometryAttribute": String`

The name of the layer attribute that contains the geometry.

##### Note

This is needed by the [`"identify"` tool](../tools/identify-tool).






