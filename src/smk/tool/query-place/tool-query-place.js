include.module( 'tool-query-place', [ 'feature-list', 'widgets', 'sidepanel', 'tool-query', 'tool-query-place.feature-place-html' ], function ( inc ) {
    "use strict";
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    Vue.component( 'query-place-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'feature-place', {
        extends: SMK.TYPE.VueFeatureComponent,
        template: inc[ 'tool-query-place.feature-place-html' ],
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function QueryPlaceTool( option ) {
        SMK.TYPE.QueryTool.prototype.constructor.call( this, $.extend( {
            order:          4,
            // position:       'menu',
            // title:          'Location',
            widgetComponent:'query-place-widget',
            instance:       'place'
        }, option ) )
    }

    SMK.TYPE.QueryPlaceTool = QueryPlaceTool

    $.extend( QueryPlaceTool.prototype, SMK.TYPE.QueryTool.prototype )
    QueryPlaceTool.prototype.afterInitialize = SMK.TYPE.QueryTool.prototype.afterInitialize.concat( [] )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    return QueryPlaceTool
} )
