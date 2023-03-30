include.module( 'tool-directions-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
    'tool-directions-config.marker-icon-blue-png',
    'tool-directions-config.marker-icon-green-png',
    'tool-directions-config.marker-icon-red-png',
    'tool-directions-config.range-limit-png',
    'tool-directions-config.marker-shadow-png',
    'tool-directions-config.range-limit-shadow-png'
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {    
            type: 'directions',     
            enabled: false, 
            order: 4, 
            position: [ 'shortcut-menu', 'list-menu' ],   
            icon: 'directions_car', 
            title: 'Route Planner',
            optimal: false,
            geocoderService: {},
            routePlannerService: {},

            segmentLayers: [
                {
                    id: "@segments",
                    title: "Segments",
                    style: {
                        strokeColor: "blue",
                        strokeWidth: 6,
                        strokeOpacity: 0.8
                    },
                    legend: {
                        line: true
                    }
                },
                {
                    id: "@segments-after-range-limit",
                    title: "Segments After Range Limit",
                    style: {
                        strokeColor: "blue",
                        strokeDashes: "10,5",
                        strokeWidth: 4,
                        strokeOpacity: 0.8
                    },
                    legend: {
                        line: true
                    }
                }
            ],
            
            waypointLayers: [
                {
                    id: "@waypoint-start",
                    title: "Starting Route Location",
                    style: {
                        markerUrl:      inc[ 'tool-directions-config.marker-icon-green-png' ],
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      inc[ 'tool-directions-config.marker-shadow-png' ],
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Starting Route Location",
                        point: true
                    },
                    isDraggable: true,
                    isQueryable: false
                },
                {
                    id: "@waypoint-end",
                    title: "Ending Route Location",
                    style: {
                        markerUrl:      inc[ 'tool-directions-config.marker-icon-red-png' ],
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      inc[ 'tool-directions-config.marker-shadow-png' ],
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Ending Route Location",
                        point: true
                    },
                    isDraggable: true,
                    isQueryable: false
                },
                {
                    id: "@waypoint-middle",
                    title: "Waypoint on Route",
                    style: {
                        markerUrl:      inc[ 'tool-directions-config.marker-icon-blue-png' ],
                        markerSize:     [ 25, 41 ],
                        markerOffset:   [ 12, 41 ],
                        shadowUrl:      inc[ 'tool-directions-config.marker-shadow-png' ],
                        shadowSize:     [ 41, 41 ],
                        popupOffset:    [ 1, -34 ],
                    },
                    legend: {
                        title: "Waypoint on Route",
                        point: true
                    },
                    isDraggable: true,
                    isQueryable: false
                }
            ],
            
            markerLayers: [
                {
                    id: "@range-limit",
                    title: "Range Limit",
                    style: {
                        markerUrl:      inc[ 'tool-directions-config.range-limit-png' ],
                        markerSize:     [ 38, 42 ],
                        markerOffset:   [ 10, 42 ],
                        shadowUrl:      inc[ 'tool-directions-config.range-limit-shadow-png' ],
                        shadowSize:     [ 38, 42 ],
                        popupOffset:    [ 1, -34 ]
                    },
                    legend: {
                        title: "Range Limit",
                        point: true
                    },
                    isDraggable: false,
                    isQueryable: false
                }
            ]
        } ) ) )
    )
} )
