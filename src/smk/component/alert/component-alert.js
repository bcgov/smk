include.module( 'component-alert', [ 
    'component',
    'component-alert.component-alert-html' 
], function ( inc ) {
    "use strict";

    Vue.component('alert', {
        template: inc[ 'component-alert.component-alert-html' ],
        data: {
            alertBody: ''
        }  
    });
} );