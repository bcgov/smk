###### [SMK](../../..) / [Configuration](..) / [Layers](.)

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
    <a href="#clusteroption-property"       >"clusterOption"</a>:       null,
    <a href="#useheatmap-property"          >"useHeatmap"</a>:          false,
    <a href="#style-property"               >"style"</a>:               null,
    <a href="#conditionalstyles-property"   >"conditionalStyles"</a>:   null,
    <a href="#legend-property"              >"legend"</a>:              null,
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


## ClusterOption Property
`"clusterOption": Object`

The [cluster option](cluster-option) object used to influence the rendering of clusters of points.

## UseHeatmap Property
`"useHeatmap": Boolean`

If `true`, the layer should use heatmap clustering.
Only relevant for point geometry layers.
The default is `false`.

## Style Property
`"style": Object | Array`

The [style object](style) used to render the features from this data source.

## ConditionalStyles Property
`"conditionalStyles": Array`

Style attributes applied to features based on feature attribute values. These style attributes override style attributes with the same name in the `style` property.

Each conditional style has a `property`, which is the name of a feature attribute, and `conditions`, an array of objects containing: 

- `value`: the value of the feature's `property` attribute
- `label`: an optional description of features matching this condition, for use in legends; if omitted; value will be used
- `style`: an object of style properties and values
- `operator`: an optional operator to use to compare the condition value to the feature's property value. Operators are:
    - `>` greater than, for number values 
    - `>=` greater than or equal to, for number values 
    - `<` less than, for number values 
    - `<=` less than or equal to, for number values 
    - `exists` a value exists (is not null or undefined)
    - `!=` not equal to 
    - `=` equal. This is also the default if no operator is given.

In this sample configuration, features having a `Station_Type` value of `Public` will be styled as blue, and features where `Station_Type` is `Private` will be styled as green.

``` 
"conditionalStyles": [
    {
        "property": "Station_Type",
        "conditions": [
            {
                "value": "Public",
                "label": "Public Stations",
                "style": {
                    "strokeColor": "#0000ff",
                    "fillColor": "#0000ff"
                }
            },
            {
                "value": "Private",
                "label": "Private Stations",
                "style": {
                    "strokeColor": "#00ff00",
                    "fillColor": "#00ff00"
                }
            }
        ]
    }
]
```

This sample configuration styles features having a `Charging_Level` value of 3 or higher with a white stroke color:

``` 
"conditionalStyles": [
    {
        "property": "Charging_Level",
        "conditions": [
            {
                "label": "Fast Charging",
                "operator": ">=",
                "value": 3,
                "style": {
                    "strokeColor": "#ffffff"
                }
            }
        ]
    }
]
```

## Legend Property
`"legend": Object`

Optional attributes to configure the display of the layer in legends.

`"point", "line", "fill": Boolean`

Set the shape of the legend swatch. "line" is the default. 

`"includeOtherLegendWithDefaultStyling": Boolean`

When <a href="#conditionalstyles-property">conditional styles</a> are used, set this to true to add an "Other" legend with a swatch using the styling in the <a href="#style-property">style</a> to represent features that are not matched by any of the conditions defined in conditional styling.

## DataUrl Property
`"dataUrl": String`

The URL that points to a GeoJSON data source.




