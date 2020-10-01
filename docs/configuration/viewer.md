###### [SMK](..) / [Configuration](.)

# Viewer

`"viewer"`: *Object*  *(OPTIONAL)*
The viewer section of configuration controls general aspects of the map viewer itself.

<pre>
{ "viewer": {
    <a href="#type-viewer"          >"type"</a>:          "leaflet",
    <a href="#basemap-viewer"       >"baseMap"</a>:       "Topographic",
    <a href="#clusterOption-viewer" >"clusterOption"</a>: { ... },
    <a href="#location-viewer">"location"</a>: {
        <a href="#locationextent-viewer">"extent"</a>: [ -139.1782, 47.6039, -110.3533, 60.5939 ],
        <a href="#locationcenter-viewer">"center"</a>: [ -124.76575, 54.0989 ],
        <a href="#locationzoom-viewer"  >"zoom"</a>:   5,
    }
} }
</pre>

### `type` (Viewer)
`"type"`: *String*  *(OPTIONAL)*
The type of map viewer to use. There are two options:

- `"leaflet"` Use the [Leaflet](https://leafletjs.com/) viewer. (Default)
- `"esri3d"` Use the [ESRI ArcGIS 3D](https://developers.arcgis.com/javascript/) viewer.

### `baseMap` (Viewer)
`"baseMap"`: *String*  *(OPTIONAL)*
The name of the default basemap to display.
One of these options:
`"Topographic"` (Default),
`"Streets"`,
`"Imagery"`,
`"Oceans"`,
`"NationalGeographic"`,
`"ShadedRelief"`,
`"DarkGray"`,
or
`"Gray"`.

### `clusterOption` (Viewer)
`"clusterOption"`: *Object*  *(OPTIONAL)*
*This option only applies to the [leaflet viewer](#type-viewer).*

A configuration object that is passed to the clustering object constructor.
The options are [defined here](https://github.com/Leaflet/Leaflet.markercluster#all-options).
One use for this configuration is to control if the convex hull of clusters is displayed, (default for this option is `false`):
```
{ "viewer": { "clusterOption" {
    "showCoverageOnHover": true
} } }
```

### `location` (Viewer)
`"location"`: *Object*  *(OPTIONAL)*
The location that map shows when the map starts.
The default value is the map centered on BC, at zoom level 5, which shows the whole province.

### `location.extent` (Viewer)
`"extent"`: *Array[Number]* *(OPTIONAL)*
The extent which must be displayed by the map at startup.
The array contains 4 values, which are in order: *`[MIN-LONG]`*,*`[MIN-LAT]`*,*`[MAX-LONG]`*,*`[MAX-LAT]`*.
This take precedence over any center and zoom settings.

### `location.center` (Viewer)
`"center"`: *Array[Number]* *(OPTIONAL)*
The center point of the map at startup.
The array contains 2 values, which are in order: *`[LONG]`*,*`[LAT]`*.

### `location.zoom` (Viewer)
`"zoom"`: *Integer* *(OPTIONAL)*
The zoom level of the map at startup.
This is a value from 0 (whole world) to 30.
The default value is 5, which shows the whole province of BC.






