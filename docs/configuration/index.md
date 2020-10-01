###### [SMK](..)

# Configuration

SMK's behaviour is completely determined by the configuration object that is loaded into it at initialization.
The configuration is expected to be in [JSON](https://www.json.org/) format.

This is a complete reference to SMK's configuration.
Click on a property name for more information.
The `"layers"` and `"tools"` collections can contain a variety of possible object types, and each of the possible types is listed under the collection name.

<pre>
{
    <a href="metadata.html#name-property"        >"name"</a>:         "SMK Demo App",
    <a href="metadata.html#version-property"     >"version"</a>:      "1.0.0",
    <a href="metadata.html#createdBy-property"   >"createdBy"</a>:    "smk",
    <a href="metadata.html#createdDate-property" >"createdDate"</a>:  "2020-07-23T19:18:25.876Z",

    <a href="viewer.html"  >"viewer"</a>: {
        <a href="viewer.html#type-property"      >"type"</a>:     "leaflet",
        <a href="viewer.html#device-property"    >"device"</a>:   "auto",
        <a href="viewer.html#basemap-property"   >"baseMap"</a>:  "Topographic",
        <a href="viewer.html#location-property"  >"location"</a>: { ... }
    },

    <a href="layers"  >"layers"</a>: [
        { "type": <a href="layers/esri-dynamic-layer.html" >"esri-dynamic"</a>  },
        { "type": <a href="layers/wms-layer.html"          >"wms"</a>           },
        { "type": <a href="layers/vector-layer.html"       >"vector"</a>        },
    ],

    <a href="tools"   >"tools"</a>: [
        { "type": <a href="tools/about-tool.html"          >"about"</a>         },
        { "type": <a href="tools/basemaps-tool.html"       >"baseMaps"</a>      },
        { "type": <a href="tools/bespoke-tool.html"        >"bespoke"</a>       },
        { "type": <a href="tools/coordinate-tool.html"     >"coordinate"</a>    },
        { "type": <a href="tools/directions-tool.html"     >"directions"</a>    },
        { "type": <a href="tools/identify-tool.html"       >"identify"</a>      },
        { "type": <a href="tools/layers-tool.html"         >"layers"</a>        },
        { "type": <a href="tools/legend-tool.html"         >"legend"</a>        },
        { "type": <a href="tools/list-menu-tool.html"      >"list-menu"</a>     },
        { "type": <a href="tools/location-tool.html"       >"location"</a>      },
        { "type": <a href="tools/markup-tool.html"         >"markup"</a>        },
        { "type": <a href="tools/measure-tool.html"        >"measure"</a>       },
        { "type": <a href="tools/minimap-tool.html"        >"minimap"</a>       },
        { "type": <a href="tools/pan-tool.html"            >"pan"</a>           },
        { "type": <a href="tools/query-tool.html"          >"query"</a>         },
        { "type": <a href="tools/scale-tool.html"          >"scale"</a>         },
        { "type": <a href="tools/search-tool.html"         >"search"</a>        },
        { "type": <a href="tools/select-tool.html"         >"select"</a>        },
        { "type": <a href="tools/shortcut-menu-tool.html"  >"shortcut-menu"</a> },
        { "type": <a href="tools/toolbar-tool.html"        >"toolbar"</a>       },
        { "type": <a href="tools/version-tool.html"        >"version"</a>       },
        { "type": <a href="tools/zoom-tool.html"           >"zoom"</a>          }
    ]
}
</pre>
