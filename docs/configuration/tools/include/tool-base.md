### `title`
`"title"`: *String* *(OPTIONAL)*
The title of this tool.
How this property is used depends on the tool type.
Tools that display a button on a toolbar use this property for the button tooltip.
Tools that show a panel use this property for the panel title.
All tools have a default title, but setting this property will override it.

### `enabled`
`"enabled"`: *Boolean* *(OPTIONAL)*
If `true` then the tool will be available when the map starts.
If `false`, then the tool will not be available.
Most tools are not enabled by default.

### `icon`
`"icon"`: *String* *(OPTIONAL)*
If the tool adds a button to a toolbar, this property gives the name of the icon to display on the button.
The icon set used is the [Material Design Icons](https://material.io/tools/icons/?icon=query_builder&style=baseline).
Each tool has a default value.

### `order`
`"order"`: *Integer* *(OPTIONAL)*
If the tool adds a button to a toolbar, this property controls the order in which the tools are added to the toolbar.
The default value is `1`, but some tools have other values as their default.
The tools are added left-to-right in ascending order.

### `position`
`"position"`: *String* *(OPTIONAL)*
If the tool adds a button to a toolbar, this property controls which toolbar gets the tool.
The default is `"toolbar"`, but some tools have other default values.
The value of this property is `"toolbar"`; or it can be the name of another tool that can act as a tool container. The tools that can be containers are [`"dropdown"`](#dropdown-tool) or [`"menu"`](#menu-tool).

The tool container must be enabled.

