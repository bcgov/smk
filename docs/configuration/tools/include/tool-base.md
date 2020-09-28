### `type` Property
`"type"`: *String* *(Required)*

The name of the type of this tool.
Identifies the tool in the configuration, this is required.


### `title` Property
`"title"`: *String* *(Default value depends on tool)*

The title of this tool.
Tools that display a panel will use this as the title of the panel.
The toolbar button for this tool will use this as the tooltip.
Tools have a default title, and setting this property will override the default title with one of the author's choosing.


### `showTitle` Property
`"showTitle"`: *Boolean* *(Defaults to `false`)*

If `true`, then the title of the tool is shown beside the button in the toolbar.
Defaults to `false`.


### `enabled` Property
`"enabled"`: *Boolean* *(Default value depends on tool)*

If `true` then the tool will be available when the map starts.
If `false`, then the tool will not be available.
Most tools are not enabled by default.


### `icon` Property
`"icon"`: *String* *(Default value depends on tool)*

If the tool adds a button to a toolbar, this property gives the name of the icon to display on the button.
The icon set used is the [Material Design Icons](https://material.io/tools/icons/?icon=query_builder&style=baseline).
Each tool has a default value.


### `position` Property
`"position"`: *String* *(Default value depends on tool)*

Some tools show a button that activates the tool, and that button must be positioned in one of the tool button containers.
The tool button containers are: `toolbar`, `list-menu`, and `shortcut-menu`.
This property's value is the name of the container, or `null` to prevent button from appearing.
The tool button container must itself be enabled.


### `order` Property
`"order"`: *Integer* *(Optional)*

If the tool adds a button to a toolbar, this property controls the order in which the tools are added to the toolbar.
The default value is `1`, but some tools have other values as their default.
The tools are added left-to-right in ascending order.
