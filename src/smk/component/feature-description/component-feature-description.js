include.module( 'component-feature-description', [ 
    'component',
    'component-feature-description.component-feature-description-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-description', {
        extends: SMK.COMPONENT.FeatureBase,
        template: inc[ 'component-feature-description.component-feature-description-html' ],
    } )
} )
