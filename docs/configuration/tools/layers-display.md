###### [SMK](../../..) / [Configuration](..) / [Tools](.) / [Layers Tool](layers)

# Layer Display Objects

The [`"layers"` tool](layers) [`"display"` property](layers#display-property) is an array of Display objects.
There are 3 types of objects:

- [`{ "type": "layer" }`](#display-layer-object)

    This object represents a layer from the [`"layers"`](../layers) section of the configuration.

- [`{ "type": "folder" }`](#display-folder-object)

    This object is container for a collection of Display objects.
    The folder can be expanded and collapsed in the layers tool, so the internal structure of the folder is accessible.
    The visibility of the folder determines the visibility of all the child objects.

- [`{ "type": "group" }`](#display-group-object)

    This object is container for a collection of Display objects.
    The group cannot be expanded in the layers tool, and so the internal structure of the group is hidden from the user.
    The visibility of the group determines the visibility of all the child objects.
    Because the internal structure is invisible, the only Display objects that make sense as child objects are [`{ "type": "layer" }`](#display-layer-object).


## Display Layer Object

This object represents a layer from the [`"layers"`](../layers) section of the configuration.

<pre>
{
    "type":      "layer",
    <a href="#display-layer-id-property"        >"id"</a>:        "layer1",
    <a href="#display-layer-title-property"     >"title"</a>:     "Layer 1",
    <a href="#display-layer-isvisible-property" >"isVisible"</a>: true,
}
</pre>


### Display Layer Id Property
`"id"`: `String`

The id of a layer from the [`"layers"`](../layers) section of the configuration.


### Display Layer Title Property
`"title"`: `String`

The title to show for the layer.
If this property is missing, the title is taken from the layer object refered to by `"id"`.


### Display Layer IsVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the layer.
If this property is missing, then the initial visibility is taken from the `"isVisible"` is taken from the layer object refered to by `"id"`.


## Display Folder Object

This object is container for a collection of Display objects.
The folder can be expanded and collapsed in the layers tool, so the internal structure of the folder is accessible.
The visibility of the folder determines the visibility of all the child objects.

<pre>
{
    "type":       "folder",
    <a href="#display-folder-id-property"        >"id"</a>:         "folder1",
    <a href="#display-folder-title-property"     >"title"</a>:      "Folder 1",
    <a href="#display-folder-isvisible-property" >"isVisible"</a>:  true,
    <a href="#display-folder-isexpanded-property">"isExpanded"</a>: false,
    <a href="#displa-yfolder-items-property"     >"items"</a>:      [ ... ],
}
</pre>

### Display Folder Id Property
`"id"`: `String`

The id of the folder, which must be unique.
It can be omitted, and an id will be generated for the folder.


### Display Folder Title Property
`"title"`: `String`

The title to show for the folder.


### Display Folder IsVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the folder, and consequently the visibility of all Display object contained within.
The default value is `true`.


### Display Folder IsExpanded Property
`"isExpanded"`: `Boolean`

Determines initial expanded state of the folder.
The default value is `false`, ie not expanded.


### Display Folder Items Property
`"items"`: `Array`

An array containing [Layer Display objects](#layer-display-objects), that are contained in this folder.



## Display Group Object

This object is container for a collection of Display objects.
The group cannot be expanded in the layers tool, and so the internal structure of the group is hidden from the user.
The visibility of the group determines the visibility of all the child objects.

<pre>
{
    "type":       "group",
    <a href="#display-group-id-property"        >"id"</a>:         "group1",
    <a href="#display-group-title-property"     >"title"</a>:      "Group 1",
    <a href="#display-group-isvisible-property" >"isVisible"</a>:  true,
    <a href="#display-group-items-property"     >"items"</a>:      [ ... ],
}
</pre>

### Display Group Id Property
`"id"`: `String`

The id of the group, which must be unique.
It can be omitted, and an id will be generated for the group.


### Display Group Title Property
`"title"`: `String`

The title to show for the group.


### Display Group IsVisible Property
`"isVisible"`: `Boolean`

Determines initial visibility of the group, and consequently the visibility of all Display object contained within.
The default value is `true`.


### Display Group Items Property
`"items"`: `Array`

An array containing [Layer Display objects](#layer-display-objects).
Because the internal structure is invisible, the only Display objects that make sense as child objects are [`{ "type": "layer" }`](#display-layer-object).
