include.module( 'tool-baseMaps-config', [
    'tool-config.tool-base-config-js',
    'tool-config.tool-widget-config-js',
    'tool-config.tool-panel-config-js',
], function ( inc ) {
    "use strict";

    SMK.CONFIG.tools.push( 
        inc[ 'tool-config.tool-base-config-js' ](
        inc[ 'tool-config.tool-widget-config-js' ](
        inc[ 'tool-config.tool-panel-config-js' ]( {
            type: 'baseMaps',
            enabled: false, 
            order: 3,
            position: [ 'shortcut-menu', 'list-menu' ],
            icon: 'map',
            title: 'Base Maps',
            mapStyle: {
                width: '110px',
                height: '110px',    
            }   
        } ) ) )
    )
} )
