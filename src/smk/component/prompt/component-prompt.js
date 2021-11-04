include.module( 'component-prompt', [ 
    'component',
    'component-prompt.component-prompt-html' 
], function ( inc ) {
    "use strict";

    Vue.component('prompt', {
        template: inc[ 'component-prompt.component-prompt-html' ],
        data: function() {
            return {
                promptBody: ''
            }
        },
        props: ['value']
    });
} );