###### [SMK](../..) / [Configuration](.)

# Viewer

The `"viewer"` section of the SMK configuration controls the overall properties of the map.
This includes the type of map engire to use ([`"type"` property](#type-property)), the starting position of the map ([`"location"` property](#location-property)), the type of devide the application is running on ([`"device"` property](#device-property)), and what theme to apply to map's user interface elements ([`"themes"` property](#themes-property)).

These are the default values for the `"viewer"` configuration.
Click on a property name for more information:
<pre>
{ "viewer": {
    <a href="#type-property"                    >"type"</a>:        "leaflet",
    <a href="#device-property"                  >"device"</a>:      "auto",
    <a href="#deviceautobreakpoint-property"    >"deviceAutoBreakpoint"</a>: 500,
    <a href="#themes-property"                  >"themes"</a>:      null
    <a href="#panelwidth-property"              >"panelWidth"</a>:  300,
    <a href="#basemap-property"                 >"baseMap"</a>:     "Topographic",
    <a href="#esriapikey-property"              >"esriApiKey"</a>:  null,
    <a href="#activeTool-property"              >"activeTool"</a>:  null,
    <a href="#minZoom-property"                 >"minZoom"</a>:  null,
    <a href="#maxZoom-property"                 >"maxZoom"</a>:  null,
    <a href="#location-property"                >"location"</a>: {
        <a href="#extent-sub-property"          >"extent"</a>:  [ -139.1782, 47.6039, -110.3533, 60.5939 ],
        <a href="#center-sub-property"          >"center"</a>:  [ -124.76575, 54.0989 ],
        <a href="#zoom-sub-property"            >"zoom"</a>:    5,
    }
} }
</pre>

## Type Property
`"type": String`

The type of map viewer to use.
There is one option:

- `"leaflet"` - use the [Leaflet](https://leafletjs.com/) viewer.


## Device Property
`"device": String`

The type of device that the map application is running on.
There are three options:

- `"auto"` - detect the device automatically (see [`"deviceAutoBreakpoint"` property](#deviceautobreakpoint-property)).
- `"desktop"` - user interface assumes that the device is a desktop computer browser.
- `"mobile"` - user interface assumes that the device is a mobile device.


## DeviceAutoBreakpoint Property
`"deviceAutoBreakpoint": Number`

When the [`"device"` property](#device-property) is `"auto"`, this value is used to detect if the device is `"desktop"` or `"mobile"`.
The width of the browser frame is compared with this property, and if the browser frame width is the larger value, then the [`"device"` property](#device-property) is `"desktop"`; otherwise `"mobile"` is used.


## Themes Property
`"themes": Array`

Load additional UI themes at startup.
These themes are defined:

- `"alpha"`
- `"beta"`
- `"gamma"`
- `"delta"`

##### Note

This property and the themes are experimental.


## PanelWidth Property
`"panelWidth": Number`

The width of the UI panel, in pixels.


## BaseMap Property
`"baseMap": String`

The name of the basemap to display at startup.
These are the possible values:

- `"BCGov"`
- `"BCGovHillshade"`
- `"Topographic"`
- `"Streets"`
- `"Imagery"`
- `"Oceans"`
- `"ShadedRelief"`
- `"DarkGray"`
- `"Gray"`


## EsriApiKey Property
`"esriApiKey": String`

An Esri API key to use with Esri's [vector basemap service](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/services/basemap-layer-service), which is used for all basemaps except *BCGov* and *BCGovHillshade*.

To provide an Esri API key, you can create an [ArcGIS Developer account](https://developers.arcgis.com/sign-up/) for free or use an [ArcGIS Online account](https://www.esri.com/en-us/arcgis/products/arcgis-online/trial) and then create an [API key](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/) in the [developer dashboard](https://developers.arcgis.com/dashboard/).

If you are not using an Esri basemap, this value can be empty. If you use an empty value with an Esri basemap, no basemap will display.


## ActiveTool Property
`"activeTool": String`

If this property is set to the id of a tool, then this tool will be active when the map is finished initialization.

## MinZoom Property
`"minZoom": Number`

The map's minimum zoom level. Set a value to override the default value of 1.

## MaxZoom Property
`"maxZoom": String`

The map's maximum zoom level. Set a value to override the default value of 22.

## Location Property
`"location": String`

The location that map shows when the map starts.
The default value is the map centered on BC, at zoom level 5, which shows the whole province.


### Extent Sub-property
`"location": { "extent": Array }`

The extent which must be displayed by the map at startup.
The array contains 4 values, which are in order: *`[MIN-LONG]`*,*`[MIN-LAT]`*,*`[MAX-LONG]`*,*`[MAX-LAT]`*.
This take precedence over any center and zoom settings.


### Center Sub-property
`"location": { "center": Array }`

The center point of the map at startup.
The array contains 2 values, which are in order: *`[LONG]`*,*`[LAT]`*.


### Zoom Sub-property
`"location": { "zoom": Number }`

The zoom level of the map at startup.
This is a value from 0 (whole world) to 30.
The default value is 5, which shows the whole province of BC.
