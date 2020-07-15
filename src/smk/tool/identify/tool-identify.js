include.module( 'tool-identify', [
    'tool-identify.tool-identify-list-js',
    'tool-identify.tool-identify-feature-js',
], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.defineComposite( [
        inc[ 'tool-identify.tool-identify-list-js' ],
        inc[ 'tool-identify.tool-identify-feature-js' ]
    ] )
} )
