include.module( 'component-feature-properties', [ 
    'component',
    'component-feature-properties.component-feature-properties-html'
], function ( inc ) {
    "use strict";

    Vue.component( 'feature-properties', {
        extends: SMK.COMPONENT.FeatureBase,
        template: inc[ 'component-feature-properties.component-feature-properties-html' ],
        computed: {
            sortedProperties: function () {
                if ( !this.feature || !this.feature.properties ) return []
                return Object.keys( this.feature.properties ).sort()
            }
        }
    } )
} )
