###### [SMK](../..) / [Configuration](..)

# Layers

The `"layers"` section of the configuration is the place to put the connection information for datasets containing geographic data.
Each layer object represents one dataset, along with all the metadata that describes how to present that dataset.
A layer object can also contain one or more query definitions which are used by the [`"query"` tool](../tools/query-tool) to allow the user to specify query parameters, and show the results of these parameterized queries on the map.
The [`"layers"` tool](../tools/layers-tool) will show a list of all the layer objects configured, in the order they are in the configuration file.
This order can be overridden using the [`"layers"` tool `"display"` property](../tools/layers-tool#display-property), which also allows layers to organized into folders and groups.

These are all the layer types available, click on the layer type to see more information about it, including it's properties and their default values:

<pre>
{ "layers": [
    { "type": <a href="esri-dynamic-layer.html" >"esri-dynamic"</a>  },
    { "type": <a href="wms-layer.html"          >"wms"</a>           },
    { "type": <a href="vector-layer.html"       >"vector"</a>        }
] }
</pre>
