include.module( 'tool-directions', [
    'tool-directions.tool-directions-waypoints-js',
    'tool-directions.tool-directions-options-js',
    'tool-directions.tool-directions-route-js',
], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.defineComposite( [
        inc[ 'tool-directions.tool-directions-waypoints-js' ],
        inc[ 'tool-directions.tool-directions-options-js' ],
        inc[ 'tool-directions.tool-directions-route-js' ]
    ] )
} )
