# SMK API

The API for SMK allows a variety of ways to specify the configuration.
The configuration controls the initial state of the map.
Once the map is started, there is no (at present) way for an application developer to interact with the map.

## `<script>` element

SMK is designed to require minimal effort to include in your website.
Only one `<script>` element is required, along with one other element (usually a `<div>`) that will contain the map.
The `<script>` element loads the `smk.js` library, which then uses a set of attributes on the `<script>` element to control how SMK will be configured.

This is an example `<script>` element with all the attributes that SMK uses.
Each attribute is described in detail below.

```html
<script src="smk.js"
    smk-container-sel="#smk-map-frame"
    smk-title-sel="#smk-title"
    smk-config="map-config.json|?"
    smk-base-url
    smk-service-url
></script>
```

### `src` attribute

*REQUIRED*

URL of the `smk.js` library.
The production build of `smk.js` is one big self-contained Javascript file.
Almost all of it's dependencies are inlined into this file.
Howver, the images that SMK uses are **not** inlined, and assumed to located in the `images/` folder relative to the location where `smk.js` is loaded from.
The `smk-base-url` attribute lets you modify this assumption.

The development build loads it's dependencies dynamically at runtime, using the base URL of `smk.js`.

### `smk-container-sel` attribute

*Not required, default is "`#smk-map-frame`"*

The value of this attribute is a selector that identifies the element that will contain the map.
This selector must match exactly one element, otherwise a fatal error occurs.

### `smk-title-sel` attribute

*Not required, default is "`head title`"*

The value of this attribute is a selector that identifies the element(s) that will contain the map's title.
This selector may match more than one element, all will get the same text.
The map title is taken from the [`name`](SMK-Client-Configuration#name-metadata) property in the configuration.

### `smk-base-url` attribute

*Not required*

The base URL for SMK resources.
This overrides the URL that is derived from the location of `smk.js`.

### `smk-service-url` attribute

*Not required*

The URL of the smks-api service.
When a SMK app is being tested from the admin UI, this attribute tells SMK how to contact the smks-api service so the locations of attachments can be resolved.

When the SMK app is exported, all the attachments are included in the export package, and contact with the service is unnecessary. This attribute would not normally be used in a deployed application.

### `smk-config` attribute

*Not required, default is "`?smk-`"*

The value of this attribute controls how the map is configured.
It contains a list of directives that specify sources of configuration, in the order to load them.
The sources are loaded left to right, with later sources overlaying earlier sources to produce the final map configuration.
The sources in the list are seperated by "`|`".
This implies that "`|`" cannot appear in any of the source definitions; also there is no escaping mechanism.
The sources are detailed in the section [Configuration sources](#configuration-sources).

The default value for this attribute ("`?smk-`") will cause SMK to look at the URL of the host page for any parameters that start with `smk-`.
If this behaviour is undesirable, then this attribute should be changed.

## Configuration sources

A configuration source definition is one of the following:

- [URL](#url)
- [JSON literal](#json-literal)
- [Parameter prefix](#parameter-prefix)
- [Shortcut](#shortcut)

### URL

A valid URL that is assumed to point a file containing JSON map configuration.

### JSON literal

Map configuration as literal JSON. No newlines should be in the JSON, unless they are escaped inside quoted strings.

### Parameter prefix

A sequence like "?*`[PREFIX]`*".

Include this source to cause SMK to parse the parameters of the URL of the host page.
The URL parameters are parsed in the standard way: first split on occurances of "`&`", and then each parameter is split into a key and value by the first occurance of "`=`".

For any parameter key that start with *`[PREFIX]`*, the prefix is removed from the key; then the (key, value) pairs are interpreted as [Configuration shortcuts](#configuration-shortcuts).

The *`[PREFIX]`* can be an zero-length string, which means that all parameters of the URL are parsed. The default value for `smk-config` is "`?smk-`", meaning that only URL parameters that start with `smk-` are parsed.

### Shortcut

See [Configuration shortcuts](#configuration-shortcuts).

## Configuration Shortcuts

Syntax is "*`[OPTION]`*=*`[VALUE]`*".

These are shortcuts that generate configuration objects.
Valid values for *`[VALUE]`* depend on the *`[OPTION]`*.
Valid values for *`[OPTION]`* are:

- [config](#config-shortcut)
- [viewer](#viewer-shortcut)
- [extent](#extent-shortcut)
- [center](#center-shortcut)
- [ll](#ll-shortcut)
- [z](#z-shortcut)
- [query](#query-shortcut)
- [layer](#layer-shortcut)
- [active-tool](#active-tool-shortcut)
- [show-tool](#show-tool-shortcut)
- [hide-tool](#hide-tool-shortcut)
- [show-layer](#show-layer-shortcut)
- [hide-layer](#hide-layer-shortcut)

### "config" shortcut

[Syntax](#syntax-notation) is "config=*`[JSON]`* **|** *`[URL]`*".

Load configuration from a URL or from literal JSON.

### "viewer" shortcut

[Syntax](#syntax-notation) is "viewer=leafet **|** esri3d".

Load configuration to set the viewer type.

### "extent" shortcut

[Syntax](#syntax-notation) is "extent=*`[MIN-LONG]`*,*`[MIN-LAT]`*,*`[MAX-LONG]`*,*`[MAX-LAT]`*".

Load configuration that sets the extent of the map that must be visible (which implies the center location, and zoom level).

### "center" shortcut

[Syntax](#syntax-notation) is "center=*`[LONG]`*,*`[LAT]`*,*`[ZOOM]`*".

Load configuration that sets the center location of the map, and the zoom level.

### "ll" shortcut

[Syntax](#syntax-notation) is "ll=*`[LONG]`*,*`[LAT]`*".

Load configuration that sets the center location of the map.

### "z" shortcut

[Syntax](#syntax-notation) is "z=*`[ZOOM]`*".

Load configuration that sets the zoom level.

### "query" shortcut

[Syntax](#syntax-notation) is "query=*`[LAYER-ID]`*,*`[CONJUNCTION]`*,**{{** *`[CLAUSE]`* **}}**".

Load configuration that will run an ad-hoc query on startup.
This sets the active tool on startup, so will conflict with ["active-tool" shortcut](#active-tool-shortcut).

### "layer" shortcut

[Syntax](#syntax-notation) is one of:

- "layer=esri-dynamic,*`[URL]`*,*`[MPCM-ID]`* **{** ,*`[TITLE]`* **}**" (currently not functional)
- "layer=wms,*`[URL]`*,*`[LAYER-NAME]`* **{** ,*`[STYLE-NAME]`* **{** ,*`[TITLE]`* **}** **}**"
- "layer=vector,*`[URL]`* **{** ,*`[TITLE]`* **}**"

Load configuration that adds a layer definition.
There are 3 types of layers that can be loaded:

- "esri-dynamic" needs the URL of the service, the mpcm id, and optionally a title. (currently not functional)
- "wms" needs the URL of the the service, the layer name, optionally the style name, and optionally a title.
- "vector" needs the URL that resolves to a GeoJSON file, and optionally a title.

### "active-tool" shortcut

[Syntax](#syntax-notation) is "active-tool=*`[TOOL-TYPE]`* **{** ,*`[TOOL-INSTANCE]`* **}**".

Load configuration that sets the tool that is to be active on startup.

### "show-tool" shortcut

[Syntax](#syntax-notation) is "show-tool=all **|** **{{** *`[TOOL-TYPE]`* **}}**".

Load configuration that enables specific tools.
If the value is "all", then all tools are enabled.

### "hide-tool" shortcut

[Syntax](#syntax-notation) is "hide-tool=all **|** **{{** *`[TOOL-TYPE]`* **}}**".

Load configuration that disables specific tools.
If the value is "all", then all tools are disabled.

### "show-layer" shortcut

[Syntax](#syntax-notation) is "show-layer=all **|** **{{** *`[LAYER-ID]`* **}}**".

Load configuration that makes specific layers visible on startup.
If the value is "all", then all *currently configured* layers are made visible.
Any layers that loaded into the configuration after this shortcut will not affected.

### "hide-layer" shortcut

[Syntax](#syntax-notation) is "hide-layer=all **|** **{{** *`[LAYER-ID]`* **}}**".

Load configuration that makes specific layers hidden on startup.
If the value is "all", then all *currently configured* layers are made hidden.
Any layers that loaded into the configuration after this shortcut will not affected.

### Syntax notation

- **|** separates alternatives.
- **{ }** encloses parts that are optional.
- **{{ }}** encloses parts that occur one or more times (comma separated).
- *`[URL]`* is a URL.
- *`[JSON]`* is either a URL pointing to JSON configuration file, or literal JSON.
- *`[MIN-LONG]`*, *`[MAX-LONG]`*, *`[LONG]`* is a longitude value.
- *`[MIN-LAT]`*, *`[MAX-LAT]`*, *`[LAT]`* is a latitude value.
- *`[ZOOM]`* is a zoom level from 1 and 30.
- *`[LAYER-ID]`* is the identifier of a layer object.
- *`[CONJUNCTION]`* is either "`and`" or "`or`".
- *`[CLAUSE]`* is {attribute name}{operator}{value}

    {attribute name} is the internal name of attribute in layer (NOTE: this is `attribute.name`, and not `attribute.id`)

    {operator} is one of:
    - `=` (equals)
    - `<` (less than)
    - `<=` (less than or equal)
    - `>` (greater than)
    - `>=` (greater than or equal)
    - `~` (contains)
    - `^~` (starts with)
    - `$~` (ends with)

    {value} is being compared with {attribute name}. It can be a number or a `"`-surrounded string.

- *`[MPCM-ID]`* is the identifier of a MPCM layer.
- *`[TITLE]`* is a title
- *`[LAYER-NAME]`* is the WMS name of a layer.
- *`[STYLE-NAME]`* is the WMS name of a style.
- *`[TOOL-TYPE]`* is a SMK tool type name.
- *`[TOOL-INSTANCE]`* is the instance of the SMK tool.

