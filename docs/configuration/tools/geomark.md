{% include_relative include/breadcrumbs.md %}

# Geomark Tool

This tool shows a panel that allows drawing, creating, and loading geomarks.

A geomark (https://apps.gov.bc.ca/pub/geomark/geomarks) is a geographic area of interest that is stored in a geomark web service and can be shared by a URL.

This is default configuration for the Geomark tool (click on a property name for more information):
<pre>
{ "tools": [ {
    {
    <a href="#type-property">"type"</a>:           "geomark",
    <a href="#geomark-service-property">"geomarkService"</a>: {
        <a href="#url-sub-property">"url"</a>:            "https://apps.gov.bc.ca/pub/geomark"
    },
    <a href="#enabled-property">"enabled"</a>:        false
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/enabled-property.md %}

## Geomark Service Property
`"geomarkService"`: `Object`

Contains properties of the geomark web service.

### URL Sub-Property
`"geomarkService"`: `{ "url": String }`

The URL of the geomark web service used.
