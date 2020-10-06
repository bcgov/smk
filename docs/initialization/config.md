###### [SMK](../..) / [Initialization](.)

# Initializing the Configuration Sources

This value controls the sources of configuration that are used to setup the map.
These configuration sources are each ultimately resolved into an object that is interpreted by the [SMK configuration schema](../configuration).

The resolved configuration objects are merged together, and the final merged object is used to setup the map ([merging rules](merging-rules)).

The default value for the source directives is `[ '?smk-' ]`, which tells SMK to look at the URL of the host page for any parameters that start with `smk-`.
If this behaviour is undesirable, then the configuration source should be changed.


## `smk-config` Attribute

*Not required, default is "`?smk-`"*

Used by the SMK [`<script>` element](#initializing-with-script-element).
It contains a list of [source directives](#source-directives), separated by "`|`"
The sources are loaded left to right, with the configuration from later sources overriding configuration from earlier sources.
A source directive cannot contain "`|`", and there is no escaping mechanism.

Example showing all types of directives:
<pre>
&lt;script src="smk/dist/smk.js"
    smk-container-sel="#smk-map-frame"
    smk-config="<a href="#url-directive">smk-config.json</a> | <a href="#json-directive">{"viewer":{"baseMap":"Streets"}}</a> | <a href="#parameter-directive">?smk-</a> | <a href="#alias-directive">zoom=7</a>"
>&lt;/script>
</pre>


## `config` Option

*Not required, default is "`[ '?smk-' ]`"*

Used by [`SMK.INIT`](..#initializing-with-smk-init).
The value is an array of [source directives](#source-directives).
The sources are loaded left to right, with the configuration from later sources overriding configuration from earlier sources.

Example showing all types of directives:
<pre>
SMK.INIT( {
    containerSel: '#smk-map-frame',
    config: [
        <a href="#url-directive">'smk-config.json'</a>,
        <a href="#object-directive">{ viewer: { baseMap: 'Streets' } }</a>,
        <a href="#parameter-directive">'?smk-'</a>,
        <a href="#alias-directive">'zoom=7'</a>
    ]
} )
</pre>


## Source Directives

A source directive is one of the following:

- [URL](#url-directive)
- [Object](#object-directive)
- [JSON](#json-directive)
- [Parameter](#parameter-directive)
- [Alias](#alias-directive)


### URL Directive

A valid URL that is assumed to point a file containing a JSON-encoded [SMK configuration](../configuration) object.


### JSON Directive

[SMK configuration](../configuration) as a literal JSON string.
No newlines should be in the JSON, unless they are escaped inside quoted strings.

This is only useful in the [`smk-config` Attribute](#smk-config-attribute), and the JSON blob must be encoded by [encodeURIComponent](https://wiki.developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).


### Object Directive

[SMK configuration](../configuration) as a Javascript object literal.

This is only useful in the [`config` Option](#config-option).


### Parameter Directive

A sequence that start with `?`.
It may be followed by any character string, like `?smk-`, or `?foo`, or `?##`.
The characters following the `?` are the **Prefix**.
A `?` with nothing following, means that the **Prefix** is an empty string.

When this directive is encountered, the URL of the current document is parsed, and the parameter section is extracted.
The parameter section is parsed according to the usual rules (split by `&` into items, and split each item by `=` into [key, value] pairs). Then if a parameter key starts with the **Prefix**, the rest of the parameter key is considered to be an [alias directive](#alias-directive) along with the parameter value.

A **Prefix** that is an empty string matches any parameter key.


### Alias Directive

A string consisting of an *`NAME`*`=`*`ARGUMENTS`*.
These are *aliases* for a blob of [SMK configuration](../configuration).
The aliases always resolve to some chunk of SMK config.

The *`NAME`* is one of:
- [`config`](#config-alias)
- [`viewer`](#viewer-alias)
- [`extent`](#extent-alias)
- [`center`](#center-alias)
- [`ll`](#ll-alias)
- [`z`](#z-alias)
- [`query`](#query-alias)
- [`layer`](#layer-alias)
- [`active-tool`](#active-tool-alias)
- [`show-tool`](#show-tool-alias)
- [`hide-tool`](#hide-tool-alias)
- [`show-layer`](#show-layer-alias)
- [`hide-layer`](#hide-layer-alias)

#### `config` Alias

- `config=`*`JSON-LITERAL`*

    The *`JSON-LITERAL`* is parsed as JSON that is assumed to be [SMK configuration](../configuration).

- `config=`*`URL`*

    Fetch the resource at *`URL`* that is assumed to be a [SMK configuration](../configuration) JSON blob.


#### `viewer` Alias

- `viewer=leaflet`

    Set the viewer type to **leaflet**.

- `viewer=esri3d`

    Set the viewer type to **esri3d**.


#### `extent` Alias

- `extent=`*`MIN-LONGITUDE`*`,`*`MIN-LATITUDE`*`,`*`MAX-LONGITUDE`*`,`*`MAX-LATITUDE`*

    Sets the initial extent of map.


#### `center` Alias

- `center=`*`LONGITUDE`*`,`*`LATITUDE`*`,`*`ZOOM`*

    Sets the initial center point of the map, and the zoom level.


#### `ll` Alias

- `ll=`*`LONGITUDE`*`,`*`LATITUDE`*

    Sets the initial center point of the map.


#### `z` Alias

- `z=`*`ZOOM`*

    Sets the initial zoom level of the map.


#### `query` Alias

- `query=`*`LAYER-ID`*`,and,`*`CLAUSE`*[`,`*`CLAUSE`*]*
- `query=`*`LAYER-ID`*`,or,`*`CLAUSE`*[`,`*`CLAUSE`*]*

    *`LAYER-ID`* must refer to a layer defined in the [`"layers"` configuration](../configuration/layers).
    *`CLAUSE`* is one or more expressions of one of these forms (*`ATTRIBUTE`* is an attribute name valid for the layer, and *`VALUE`* is a JSON-encoded literal):
    - *`ATTRIBUTE`* `=`  *`VALUE`* (equals)
    - *`ATTRIBUTE`* `~`  *`VALUE`* (contains)
    - *`ATTRIBUTE`* `^~` *`VALUE`* (starts with)
    - *`ATTRIBUTE`* `$~` *`VALUE`* (ends with)
    - *`ATTRIBUTE`* `>`  *`VALUE`* (greater than)
    - *`ATTRIBUTE`* `<`  *`VALUE`* (less than)
    - *`ATTRIBUTE`* `>=` *`VALUE`* (greater than or equal)
    - *`ATTRIBUTE`* `<=` *`VALUE`* (less than or equal)

    Mulitple clauses are joined with either `and` or `or`.

    Configures a [query object](../configuration/layers/query) for the layer, and a matching [`"query"` tool](../configuration/tools/query) with the auto-execute flag, and sets the tool automatically active at startup.


#### `layer` Alias

- `layer=esri-dynamic,`*`URL`*,*`MPCM-ID`*`,`*`TITLE`* (currently not functional)

    Add a [`"esri-dynamic"` layer](../configuration/layers/esri-dynamic). *`TITLE`* is optional.

- `layer=wms,`*`URL`*`,`*`LAYER-NAME`*`,`*`STYLE-NAME`*`,`*`TITLE`*

    Add a [`"wms"` layer](../configuration/layers/wms). *`STYLE-NAME`*, and *`TITLE`* are optional.

- `layer=vector,`*`URL`*`,`*`TITLE`*

    Add a [`"vector"` layer](../configuration/layers/vector). *`TITLE`* is optional.


#### `active-tool` Alias

- `active-tool=`*`TOOL`*`,`*`INSTANCE`*

    Make *`TOOL`* active when the map starts.
    *`INSTANCE`* is optional.


#### `show-tool` Alias

- `show-tool=`*`TOOL`*[`,`*`TOOL`*]*

    Enable these *`TOOL`* s.

- `show-tool=all`

    Enable all tools.


#### `hide-tool` Alias

- `hide-tool=`*`TOOL`*[`,`*`TOOL`*]*

    Disable these *`TOOL`* s.

- `hide-tool=all`

    Disable all tools.


#### `show-layer` Alias

- `show-layer=`*`LAYER-ID`*[`,`*`LAYER-ID`*]*

    Set the visibility flag for the layers with these *`LAYER-ID`* s to `true`.

- `show-layer=all`

    Set the visibility flag for all configured layers to `true`.


#### `hide-layer` Alias

- `hide-layer=`*`LAYER-ID`*[`,`*`LAYER-ID`*]*

    Set the visibility flag for the layers with these *`LAYER-ID`* s to `false`.

- `hide-layer=all`

    Set the visibility flag for all configured layers to `false`.

