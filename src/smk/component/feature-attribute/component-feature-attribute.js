include.module( 'component-feature-attribute', [ 
    'component-feature-attribute.component-feature-attribute-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-attribute', {
        template: inc[ 'component-feature-attribute.component-feature-attribute-html' ],
        props: {
            title: { type: String },
            value: { type: String },
        }        
    } )
} )
