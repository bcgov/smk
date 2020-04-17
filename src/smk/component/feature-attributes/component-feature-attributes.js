include.module( 'component-feature-attributes', [ 
    'component',
    'component-feature-attribute',
    'component-feature-attributes.component-feature-attributes-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-attributes', {
        extends: SMK.COMPONENT.FeatureBase,
        template: inc[ 'component-feature-attributes.component-feature-attributes-html' ],
    } )
} )
