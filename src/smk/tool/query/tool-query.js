include.module( 'tool-query', [
    'tool-query.tool-query-parameters-js',
    'tool-query.tool-query-results-js',
    'tool-query.tool-query-feature-js',
], function ( inc ) {
    "use strict";

    return SMK.TYPE.Tool.defineComposite( [
        inc[ 'tool-query.tool-query-parameters-js' ],
        inc[ 'tool-query.tool-query-results-js' ],
        inc[ 'tool-query.tool-query-feature-js' ]
    ] )
} )
