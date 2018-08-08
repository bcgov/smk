include.module( 'tool-about', [ 'tool', 'widgets', 'tool-about.panel-about-html' ], function ( inc ) {
    "use strict";

    Vue.component( 'about-widget', {
        extends: inc.widgets.toolButton,
    } )

    Vue.component( 'about-panel', {
        extends: inc.widgets.toolPanel,
        template: inc[ 'tool-about.panel-about-html' ],
        props: [ 'content' ]
    } )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function AboutTool( option ) {
        this.makePropWidget( 'icon', 'help' )
        this.makePropPanel( 'content', null )

        SMK.TYPE.Tool.prototype.constructor.call( this, $.extend( {
            widgetComponent:'about-widget',
            panelComponent: 'about-panel',
            title:          'About SMK',
            position:       'menu'
        }, option ) )

    }

    SMK.TYPE.AboutTool = AboutTool

    $.extend( AboutTool.prototype, SMK.TYPE.Tool.prototype )
    AboutTool.prototype.afterInitialize = []
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    AboutTool.prototype.afterInitialize.push( function ( smk ) {
        var self = this

        smk.on( this.id, {
            'activate': function () {
                if ( !self.visible || !self.enabled ) return

                self.active = !self.active
            }
        } )

    } )

    return AboutTool
} )
