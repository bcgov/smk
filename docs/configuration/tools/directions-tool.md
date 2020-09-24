## Directions Tool

Add a button to the toolbar, that shows a panel that allows the user to pick locations on the map, and calculate the fastest (or shortest) route between them.

This tool interacts with the [`"identify"`](#identify-tool) and [`"location"`](#location-tool) tools.
When this tool is enabled, the popups for identify and location will contain a button to start a route from that location.

<pre>
{ "tools": [ {
    <a href="#type-tool"        >"type"</a>:     "directions",
    <a href="#title-tool"       >"title"</a>:    "Directions",
    <a href="#enabled-tool"     >"enabled"</a>:  true,
    <a href="#icon-tool"        >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=directions_car" target="material">"directions_car"</a>,
    <a href="#order-tool"       >"order"</a>:    4,
    <a href="#position-tool"    >"position"</a>: "toolbar",
    <a href="#apikey-directions-tool">"apiKey"</a>:   "...",
} ] }
</pre>

### `apiKey` (Directions Tool)
`"apiKey"`: *String* *(REQUIRED)*  
The API key used to get access the [BC Route Planner API](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/route-planner).
The API key is required to access the service, the directions tool won't work without it.

