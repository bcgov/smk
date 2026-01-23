###### [SMK](../..)

# Configuration

SMK's behaviour is completely determined by the configuration object that is loaded into it at initialization.
The configuration is expected to be in [JSON](https://www.json.org/) format.

This is a complete reference to SMK's configuration.
Click on a property name for more information.
The `"layers"` and `"tools"` collections can contain a variety of possible object types, and each of the possible types is listed under the collection name.

<pre>
{
    <a href="metadata#name-property"        >"name"</a>:         "SMK Demo App",
    <a href="metadata#version-property"     >"version"</a>:      "1.0.0",
    <a href="metadata#createdBy-property"   >"createdBy"</a>:    "smk",
    <a href="metadata#createdDate-property" >"createdDate"</a>:  "2020-07-23T19:18:25.876Z",

    <a href="viewer"  >"viewer"</a>: {
        <a href="viewer#type-property"      >"type"</a>:     "leaflet",
        <a href="viewer#device-property"    >"device"</a>:   "auto",
        <a href="viewer#basemap-property"   >"baseMap"</a>:  "Topographic",
        <a href="viewer#location-property"  >"location"</a>: { ... }
    },

    <a href="layers"  >"layers"</a>: [
        { "type": <a href="layers/esri-dynamic" >"esri-dynamic"</a>  },
        { "type": <a href="layers/wms"          >"wms"</a>           },
        { "type": <a href="layers/vector"       >"vector"</a>        },
    ],

    <a href="tools"   >"tools"</a>: [
        { "type": <a href="tools/about"          >"about"</a>         },
        { "type": <a href="tools/basemaps"       >"baseMaps"</a>      },
        { "type": <a href="tools/bespoke"        >"bespoke"</a>       },
        { "type": <a href="tools/coordinate"     >"coordinate"</a>    },
        { "type": <a href="tools/directions"     >"directions"</a>    },
        { "type": <a href="tools/geomark"        >"geomark"</a>       },
        { "type": <a href="tools/identify"       >"identify"</a>      },
        { "type": <a href="tools/layers"         >"layers"</a>        },
        { "type": <a href="tools/legend"         >"legend"</a>        },
        { "type": <a href="tools/list-menu"      >"list-menu"</a>     },
        { "type": <a href="tools/location"       >"location"</a>      },
        { "type": <a href="tools/markup"         >"markup"</a>        },
        <!-- { "type": <a href="tools/measure"        >"measure"</a>       }, -->
        { "type": <a href="tools/minimap"        >"minimap"</a>       },
        { "type": <a href="tools/pan"            >"pan"</a>           },
        { "type": <a href="tools/query"          >"query"</a>         },
        { "type": <a href="tools/scale"          >"scale"</a>         },
        { "type": <a href="tools/search"         >"search"</a>        },
        { "type": <a href="tools/select"         >"select"</a>        },
        { "type": <a href="tools/shortcut-menu"  >"shortcut-menu"</a> },
        { "type": <a href="tools/toolbar"        >"toolbar"</a>       },
        { "type": <a href="tools/version"        >"version"</a>       },
        { "type": <a href="tools/zoom"           >"zoom"</a>          }
    ]
}
</pre>
