###### [SMK](../../..) / [Configuration](..) / [Layers](.)

# ESRI Dynamic Layer

This is default configuration for the ESRI Dynamic layer.
Click on a property name for more information:
<pre>
{ "layers": [ {
    <a href="#type-property"            >"type"</a>:            "esri-dynamic",
    <a href="#id-property"              >"id"</a>:              null,
    <a href="#title-property"           >"title"</a>:           null,
    <a href="#opacity-property"         >"opacity"</a>:         null,
    <a href="#isvisible-property"       >"isVisible"</a>:       false,
    <a href="#isqueryable-property"     >"isQueryable"</a>:     true,
    <a href="#minscale-property"        >"minScale"</a>:        null,
    <a href="#maxscale-property"        >"maxScale"</a>:        null,
    <a href="#metadataurl-property"     >"metadataUrl"</a>:     null,
    <a href="#popuptemplate-property"   >"popupTemplate"</a>:   null,
    <a href="#titleattribute-property"  >"titleAttribute"</a>:  null,
    <a href="#attributes-property"      >"attributes"</a>:      null,
    <a href="#queries-property"         >"queries"</a>:         null,
    <a href="#mpcmid-property"          >"mpcmId"</a>:          null,
    <a href="#mpcmworkspace-property"   >"mpcmWorkspace"</a>:   null,
    <a href="#serviceurl-property"      >"serviceUrl"</a>:      null,
    <a href="#dynamiclayers-property"   >"dynamicLayers"</a>:   null
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

## MpcmId Property
`"mpcmId": String`

The ID used for this layer in the DataBC Layer Catalog.


## MpcmWorkspace Property
`"mpcmWorkspace": String`

The workspace used for this layer in the DataBC Layer Catalog.


## ServiceUrl Property
`"serviceUrl": String`

The URL for the DataBC Layer Catalog.


## DynamicLayers Property
`"dynamicLayers": Array`

A listing of dynamic layer configurations. This will typically contain configuration for a single layer. The default configuration comes from the MPCM Layer Catalog.

### DrawingInfo Property
`"drawingInfo": Object`

Each `dynamicLayers` property includes a `drawingInfo` property which defines the appearance of the layer on the map. `drawingInfo` can be manually edited to configure aspects of layer display. For more information, see <a href="https://developers.arcgis.com/web-map-specification/objects/drawingInfo">`drawingInfo` documentation</a>.