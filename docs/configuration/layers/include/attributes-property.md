## Attributes Property
`"attributes": Array`

An array of [attribute objects](layer-attribute).
Used to control how feature attributes appear in the popup that is used by the [`"identify"` tool](../tools/identify-tool), [`"query"` tool](../tools/query-tool), and [`"select"` tool](../tools/select-tool).

##### Note

The order of the attribute objects, is the order they will appear in the popup.
If this property is `null` or missing, then the popup will show all the attributes of the feature, using the internal field names.
If this property is an empty array (`[]`), then no attributes will be shown for the feature.
