include.module( 'tool-identify-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
    'tool-config.tool-panel-feature-config-js',
    'tool-identify-config.crosshair-png'
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push(
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ](
        inc[ 'tool-config.tool-panel-feature-config-js' ]( {
            type: 'identify',
            enabled: false,
            order: 5,
            position: 'list-menu',
            icon: 'info_outline',
            title: 'Identify Features',
            command: {
                select: true,
                radius: false,
                radiusUnit: false,
                nearBy: true
            },
            radius: 5,
            radiusUnit: 'px',
            internalLayers: [
                {
                    id: "@identify-search-area",
                    title: "Identify Search Area",
                    style: [
                        {
                            stroke:             false,
                            fill:               true,
                            fillColor:          "white",
                            fillOpacity:        0.5,
                        },
                        {
                            strokeWidth:        6,
                            strokeColor:        "black",
                            strokeOpacity:      1,
                            strokeCap:          "butt",
                            strokeDashes:       "6,6",
                            strokeDashOffset:   6
                        },
                        {
                            strokeWidth:        6,
                            strokeColor:        "white",
                            strokeOpacity:      1,
                            strokeCap:          "butt",
                            strokeDashes:       "6,6"
                        }
                    ],
                    legend: {
                        line: true
                    }
                },
                {
                    id: "@identify-location",
                    title: "Identify Location",
                    style: {
                        markerUrl: inc[ 'tool-identify-config.crosshair-png' ],
                        markerSize: [ 40, 40 ],
                        markerOffset: [ 20, 20 ]
                    },
                    legend: {
                        point: true
                    }
                },
                {
                    id: "@identify-edit-search-area",
                    title: "Identify Edit Search Area",
                    style: [
                        {
                            strokeWidth:        3,
                            strokeColor:        "red",
                            strokeOpacity:      1
                        }
                    ],
                    legend: {
                        line: true
                    }
                }
            ]
        } ) ) ) )
    )
} )
