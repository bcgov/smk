# Layer Display Objects

## DisplayLayer Object

This represents one layer from the `"layers"` section.

<pre>
{
    "type":      "layer",
    <a href="#displaylayer-id-property"        >"id"</a>:        "layer1",
    <a href="#displaylayer-title-property"     >"title"</a>:     "Layer 1",
    <a href="#displaylayer-isvisible-property" >"isVisible"</a>: true,
}
</pre>


### DisplayLayer.Id Property
`"id"`: `String`

The id of a layer from the [layers](#layer) section of the configuration.


### DisplayLayer.Title Property
`"title"`: `String`

The title to show for the layer.
If this property is missing, the title is taken from the layer object refered to by `"id"`.


### DisplayLayer.IsVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the layer.
If this property is missing, then the initial visibility is taken from the `"isVisible"` is taken from the layer object refered to by `"id"`.


## DisplayFolder Object

<pre>
{
    "type":       "folder",
    <a href="#displayfolder-id-property"        >"id"</a>:         "folder1",
    <a href="#displayfolder-title-property"     >"title"</a>:      "Folder 1",
    <a href="#displayfolder-isvisible-property" >"isVisible"</a>:  true,
    <a href="#displayfolder-isexpanded-property">"isExpanded"</a>: false,
    <a href="#displayfolder-items-property"     >"items"</a>:      [ ... ],
}
</pre>

### DisplayFolder.Id Property
`"id"`: `String`

The id of the folder, which must be unique.
It can be omitted, and an id will be generated for the folder.


### DisplayFolder.title Property
`"title"`: `String`

The title to show for the folder.


### DisplayFolder.isVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the folder, and consequently the visibility of all Display object contained within.
The default value is `true`.


### DisplayFolder.isExpanded Property
`"isExpanded"`: `Boolean`

Determines initial expanded state of the folder.
The default value is `false`, ie not expanded.


### DisplayFolder.items Property
`"items"`: `Array`

An array containing Layer Display objects, that are contained in this folder.



## DisplayGroup Object

<pre>
{
    "type":       "group",
    <a href="#displaygroup-id-property"        >"id"</a>:         "group1",
    <a href="#displaygroup-title-property"     >"title"</a>:      "Group 1",
    <a href="#displaygroup-isvisible-property" >"isVisible"</a>:  true,
    <a href="#displaygroup-items-property"     >"items"</a>:      [ ... ],
}
</pre>

### DisplayGroup.Id Property
`"id"`: `String`

The id of the group, which must be unique.
It can be omitted, and an id will be generated for the group.


### DisplayGroup.title Property
`"title"`: `String`

The title to show for the group.


### DisplayGroup.isVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the group, and consequently the visibility of all Display object contained within.
The default value is `true`.


### DisplayGroup.items Property
`"items"`: `Array`

An array containing DisplayLayer objects

