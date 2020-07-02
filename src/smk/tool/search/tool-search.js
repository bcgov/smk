include.module( 'tool-search', [
    'tool-search.tool-search-list-js',
    'tool-search.tool-search-location-js',
], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.defineComposite( [
        inc[ 'tool-search.tool-search-list-js' ],
        inc[ 'tool-search.tool-search-location-js' ]
    ] )
} )
