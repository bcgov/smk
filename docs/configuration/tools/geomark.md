{% include_relative include/breadcrumbs.md %}

# Geomark Tool

This tool shows a panel that allows drawing, creating, and loading geomarks.

A geomark (https://apps.gov.bc.ca/pub/geomark/geomarks) is a geographic area of interest that is stored in a geomark web service and can be shared by a URL.

This is default configuration for the Geomark tool (click on a property name for more information):
<pre>
{ "tools": [ {
    {
    <a href="#type-property">"type"</a>:           "geomark",
    <a href="#title-property">"title"</a>:          "Geomark",
    <a href="#showtitle-property">"showTitle"</a>:      false,
    <a href="#geomark-service-property">"geomarkService"</a>: {
        <a href="#url-sub-property">"url"</a>:            "https://apps.gov.bc.ca/pub/geomark"
    },
    <a href="#enable-create-from-file-property">"enableCreateFromFile"</a>: false,
    <a href="#enabled-property">"enabled"</a>:        false,
    <a href="#icon-property"     >"icon"</a>:           <a href="https://material.io/tools/icons/?icon=build" target="material">"build"</a>,
    <a href="#order-property"    >"order"</a>:          1,
    <a href="#position-property" >"position"</a>:       "list-menu"
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}

## Geomark Service Property
`"geomarkService"`: `Object`

Contains properties of the geomark web service.

### URL Sub-Property
`"geomarkService"`: `{ "url": String }`

The URL of the geomark web service used.

## Enable Create From File Property
`"enableCreateFromFile"`: `Boolean`

When set to true, a link will be added to the panel that opens a new browser tab to the page of the geomark service where a file can be uploaded to create a new geomark. The geomark's link can then be used to load a geomark.
