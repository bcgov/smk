include.module( 'component-activate-tool', [ 
    // 'vue', 
    // // 'widgets.tool-button-html', 
    // 'widgets.command-button-html',
    // 'widgets.toggle-button-html', 
    // 'widgets.select-option-html', 
    // 'widgets.select-dropdown-html',
    // 'widgets.enter-input-html',
    'component',
    'component-activate-tool.component-activate-tool-html' 
], function ( inc ) {
    "use strict";

    Vue.component( 'activate-tool', {
        extends: SMK.COMPONENT.ToolEmit,
        template: inc[ 'component-activate-tool.component-activate-tool-html' ],
        props: { 
            id:     { type: String },
            title:  { type: String }
        }
    } )
} )