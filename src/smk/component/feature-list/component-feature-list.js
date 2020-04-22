include.module( 'component-feature-list', [ 
    'component-feature-list.component-feature-list-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-list', {
        template: inc[ 'component-feature-list.component-feature-list-html' ],
        props: { 
            layers: Array,
            highlightId: String
        },
        computed: {
            featureCount: {
                get: function () {
                    if ( !this.layers || this.layers.length == 0 ) return 0
                    return this.layers.reduce( function ( accum, ly ) { return accum + ly.features.length }, 0 )
                }
            }
        }
    } )
} )
