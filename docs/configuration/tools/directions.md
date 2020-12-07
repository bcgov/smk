{% include_relative include/breadcrumbs.md %}

# Directions Tool

Add a button to the toolbar, that shows a panel that allows the user to pick locations on the map, and calculate the fastest (or shortest) route between them.

This tool interacts with the [`"identify"` tool](identify) and [`"location"` tool](location).
When this tool is enabled, the popups for identify and location will contain a button to start a route from that location.

The application developer will need to acquire and provide a value for the `"apiKey"` in the [`"routePlannerService"` property](#routeplannerservice-property) in order to use this tool.

This is default configuration for the Directions tool (click on a property name for more information):
<pre>
{ "tools": [ {
    <a href="#type-property"     >"type"</a>:      "directions",
    <a href="#title-property"    >"title"</a>:     "Route Planner",
    <a href="#showtitle-property">"showTitle"</a>: false,
    <a href="#enabled-property"  >"enabled"</a>:   false,
    <a href="#icon-property"     >"icon"</a>:      <a href="https://material.io/tools/icons/?icon=help" target="material">"directions_car"</a>,
    <a href="#order-property"    >"order"</a>:     4,
    <a href="#position-property" >"position"</a>:  [ "shortcut-emnu", "list-menu", "toolbar" ],
    <a href="#command-property"  >"command"</a>:   {
        <a href="#optimal-sub-property"     >"optimal"</a>:     true,
        <a href="#roundtrip-sub-property"   >"roundTrip"</a>:   true,
        <a href="#criteria-sub-property"    >"criteria"</a>:    true,
        <a href="#vehicletype-sub-property" >"vehicleType"</a>: true,
        <a href="#truckroute-sub-property"  >"truckRoute"</a>:  true,
        <a href="#truckheight-sub-property" >"truckHeight"</a>: true,
        <a href="#truckwidth-sub-property"  >"truckWidth"</a>:  true,
        <a href="#trucklength-sub-property" >"truckLength"</a>: true,
        <a href="#truckweight-sub-property" >"truckWeight"</a>: true,
    },
    <a href="#truck-property"           >"truck"</a>:       false,
    <a href="#optimal-property"         >"optimal"</a>:     false,
    <a href="#roundtrip-property"       >"roundTrip"</a>:   false,
    <a href="#criteria-property"        >"criteria"</a>:    "shortest",
    <a href="#truckroute-property"      >"truckRoute"</a>:  null,
    <a href="#truckheight-property"     >"truckHeight"</a>: null,
    <a href="#truckwidth-property"      >"truckWidth"</a>:  null,
    <a href="#trucklength-property"     >"truckLength"</a>: null,
    <a href="#truckweight-property"     >"truckWeight"</a>: null,
    <a href="#geocoderservice-property" >"geocoderService"</a>: {
        "url": "https://geocoder.api.gov.bc.ca/",
        "timeout": 10000,
        "parameter": {}
    }
    <a href="#routeplannerservice-property" >"routePlannerService"</a>: {
        "url": "https://router.api.gov.bc.ca/",
        "apiKey": null
    }
} ] }
</pre>

{% include_relative include/type-property.md %}
{% include_relative include/title-property.md %}
{% include_relative include/show-title-property.md %}
{% include_relative include/enabled-property.md %}
{% include_relative include/icon-property.md %}
{% include_relative include/order-property.md %}
{% include_relative include/position-property.md %}

## Command Property
`"command"`: `Object`

Determines which controls are visible on the panels for this tool.


### Optimal Sub-Property
`"command"`: `{ "optimal": Boolean }`

If `true`, shows the Optimal control in the directions tool options.


### RoundTrip Sub-Property
`"command"`: `{ "roundTrip": Boolean }`

If `true`, shows the Round Trip control in the directions tool options.


### Criteria Sub-Property
`"command"`: `{ "criteria": Boolean }`

If `true`, shows the Criteria control in the directions tool options.


### VehicleType Sub-Property
`"command"`: `{ "vehicleType": Boolean }`

If `true`, shows the Vehicle Type control in the directions tool options.


### TruckRoute Sub-Property
`"command"`: `{ "truckRoute": Boolean }`

If `true`, shows the Truck Route control in the directions tool options.


### TruckHeight Sub-Property
`"command"`: `{ "truckHeight": Boolean }`

If `true`, shows the Truck Height control in the directions tool options.


### TruckWidth Sub-Property
`"command"`: `{ "truckWidth": Boolean }`

If `true`, shows the Truck Width control in the directions tool options.


### TruckLength Sub-Property
`"command"`: `{ "truckLength": Boolean }`

If `true`, shows the Truck Length control in the directions tool options.


### TruckWeight Sub-Property
`"command"`: `{ "truckWeight": Boolean }`

If `true`, shows the Truck Weight control in the directions tool options.


## Truck Property
`"truck"`: `Boolean`

If `true`, the route planner generates a route specifically for a truck, otherwise the route is for any vehicle.


## Optimal Property
`"optimal"`: `Boolean`

If `true`, the route planner will optimize the order of waypoints to find the shortest route, otherwise the waypoints are taken in the order presented.


## RoundTrip Property
`"roundTrip"`: `Boolean`

If `true`, the route planner will generate a route that visits all waypoints, and then returns to the first one. Otherwise, the route will start at the first waypoint, and end at the last waypoint.


## Criteria Property
`"criteria"`: `String`

The value can be `"fastest"` or `"shortest"`, and the route planner will try to find the best route according to that constraint.
See [Route Planner Docs](https://catalogue.data.gov.bc.ca/dataset/bc-route-planner/resource/82cd3194-0955-4d7e-b35a-78a98fda153a/view/80721e92-1a39-4300-ac76-6cfb09493d81#operations-tag-directions).


## TruckRoute Property
`"truckRoute"`: `Number`

Truck route multiplier.
See [Route Planner Docs](https://catalogue.data.gov.bc.ca/dataset/bc-route-planner/resource/82cd3194-0955-4d7e-b35a-78a98fda153a/view/80721e92-1a39-4300-ac76-6cfb09493d81#operations-tag-directions).


## TruckHeight Property
`"truckHeight"`: `Number`

Height of truck in meters.


## TruckWidth Property
`"truckWidth"`: `Number`

Width of truck in meters.


## TruckLength Property
`"truckLength"`: `Number`

Length of truck in meters.


## TruckWeight Property
`"truckWeight"`: `Number`

Weight of truck in kilograms.


## GeocoderService Property
`"geocoderService"`: `Object`

The configuration object used to connect to the [BC Geocoder Service](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/geocoder).
The default configuration object is:
```
{
    "url": "https://geocoder.api.gov.bc.ca/",
    "timeout": 10000,
    "parameter": {}
}
```
Typically an application will need a specific form of geocoder request, and so will need to provide a `"parameters"` object.


## RoutePlannerService Property
`"routePlannerService"`: `Object`

The configuration object used to connect to the [BC Route Planner](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/route-planner).
The default configuration object is:
```
{
    "url": "https://router.api.gov.bc.ca/",
    "apiKey": null
}
```
The application developer will need to acquire and provide a value for the `"apiKey"` in order to use this service.
See the Route Planner documentation for details.
