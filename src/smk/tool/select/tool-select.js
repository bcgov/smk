include.module( 'tool-select', [
    'tool-select.tool-select-list-js',
    'tool-select.tool-select-feature-js',
], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.defineComposite( [
        inc[ 'tool-select.tool-select-list-js' ],
        inc[ 'tool-select.tool-select-feature-js' ]
    ] )
} )
