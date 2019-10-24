include.module( 'smk-map', [ 'jquery', 'util', 'theme-base', 'sidepanel' ], function () {
    "use strict";

    function SmkMap( option ) {
        this.$option = option

        this.$dispatcher = new Vue()
    }

    SMK.TYPE.SmkMap = SmkMap

    SmkMap.prototype.initialize = function () {
        var self = this;

        console.groupCollapsed( 'SMK initialize ' + this.$option[ 'id' ] )

        console.log( 'options:', JSON.parse( JSON.stringify( this.$option ) ) )

        var container = $( this.$option[ 'container-sel' ] )
        if ( container.length != 1 )
            throw new Error( 'smk-container-sel "' + this.$option[ 'container-sel' ] + '" doesn\'t match a unique element' )

        this.$container = container.get( 0 )

        $( this.$container )
            .addClass( 'smk-map-frame smk-hidden' )

        var spinner = $( '<img class="smk-startup smk-spinner">' )
            .attr( 'src', include.option( 'baseUrl' ) + '/images/spinner.gif' )
            .appendTo( this.$container )

        var status = $( '<div class="smk-startup smk-status">' )
            .text( 'Reticulating splines...' )
            .appendTo( this.$container )

        return SMK.UTIL.promiseFinally(
            SMK.UTIL.resolved()
                .then( loadConfigs )
                .then( mergeConfigs )
                // .then( resolveConfig )
                .then( initMapFrame )
                .then( resolveDeviceConfig )
                .then( checkTools )
                .then( loadViewer )
                .then( loadTools )
                .then( initViewer )
                .then( initTools )
                .then( showMap )
                .catch( function ( e ) {
                    console.error( e )

                    $( self.$container )
                        .removeClass( 'smk-hidden' )

                    status.html(
                        '<h3>SMK initialization failed</h3><br>' +
                        e + ( e.parseSource ? ',<br>while parsing ' + e.parseSource : '' )
                    )
                    spinner.remove()

                    return Promise.reject()
                } ),
            function () {
                console.groupEnd()
            }
        )

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        function loadConfigs() {
            return SMK.UTIL.waitAll( self.$option.config.map( function ( c ) {
                if ( !c.url )
                    return SMK.UTIL.resolved( c )

                var id = c.url.toLowerCase().replace( /[^a-z0-9]+/g, '-' ).replace( /^[-]|[-]$/g, '' )
                var tag = 'config-' + id
                try {
                    include.tag( tag, { loader: 'template', url: c.url } )
                }
                catch ( e ) {
                    console.warn( e )
                }

                return include( tag )
                    .then( function ( inc ) {
                        var obj = JSON.parse( inc[ tag ] )
                        obj.$sources = c.$sources
                        return obj
                    } )
                    .catch( function ( e ) {
                        console.warn( c.$sources[ 0 ] )
                        e.parseSource = c.$sources[ 0 ]
                        throw e
                    } )
            } ) )
        }

        function mergeConfigs( configs ) {
            var config = Object.assign( {}, SMK.CONFIG )
            config.$sources = []

            console.log( 'base', JSON.parse( JSON.stringify( config ) ) )

            while( configs.length > 0 ) {
                var c = configs.shift()

                console.log( 'merging', JSON.parse( JSON.stringify( c ) ) )

                mergeViewer( config, c )
                mergeTools( config, c )
                mergeLayers( config, c )

                config.$sources = config.$sources.concat( c.$sources || '(unknown)' )
                delete c.$sources

                Object.assign( config, c )

                console.log( 'merged', JSON.parse( JSON.stringify( config ) ) )
            }

            Object.assign( self, config )

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            function mergeViewer( base, merge ) {
                if ( !merge.viewer ) return

                if ( base.viewer ) {
                    if ( base.viewer.location && merge.viewer.location ) {                        
                        Object.assign( base.viewer.location, merge.viewer.location )
                        delete merge.viewer.location
                    }

                    Object.assign( base.viewer, merge.viewer )
                }
                else {
                    base.viewer = merge.viewer
                }

                delete merge.viewer
            }


            function mergeTools( base, merge ) {
                return mergeCollection( base, merge, 'tools', {
                    findFn: function ( merge ) {
                        return function ( base ) {
                            return ( merge.type == base.type || merge.type == '*' ) &&
                                ( !merge.instance || merge.instance == base.instance )
                        }
                    },
                    mergeFn: function ( base, merge ) {
                        if ( merge.type && merge.type == '*' ) {
                            var m = JSON.parse( JSON.stringify( merge ) )
                            delete m.type
                            Object.assign( base, m )
                        }
                        else if ( merge.type === 'layers' ) {
                            mergeLayerDisplays( base, merge )
                            Object.assign( base, merge )
                        }
                        else {
                            Object.assign( base, merge )
                        }
                    }
                } )
            }

            function mergeLayerDisplays( base, merge ) {
                return mergeCollection( base, merge, 'display', {
                    findFn: function ( merge ) {
                        return function ( base ) {
                            return merge.id == base.id
                        }
                    },
                    mergeFn: function ( base, merge ) {
                        mergeLayerDisplays( base, merge )

                        Object.assign( base, merge )
                    }
                } )
            }

            function mergeLayers( base, merge ) {
                return mergeCollection( base, merge, 'layers', {
                    findFn: function ( merge ) {
                        return function ( base ) {
                            return merge.id == base.id || merge.id.startsWith( '*' )
                        }
                    },
                    mergeFn: function ( baseLayer, mergeLayer ) {
                        mergeCollection( baseLayer, mergeLayer, 'queries', {
                            mergeFn: function ( baseQuery, mergeQuery ) {
                                mergeCollection( baseQuery, mergeQuery, 'parameters', {} )

                                Object.assign( baseQuery, mergeQuery )
                            }
                        } )

                        if ( mergeLayer.id == '**' && !mergeLayer.layers )
                            mergeLayer.layers = [ JSON.parse( JSON.stringify( mergeLayer ) ) ]

                        mergeLayers( baseLayer, mergeLayer )

                        if ( mergeLayer.id && mergeLayer.id.startsWith( '*' ) ) {
                            var m = JSON.parse( JSON.stringify( mergeLayer ) )
                            delete m.id
                            Object.assign( baseLayer, m )
                        }
                        else {
                            Object.assign( baseLayer, mergeLayer )
                        }
                    }
                } )
            }

            function mergeCollection( base, merge, prop, arg ) {
                var findFn = arg[ 'findFn' ] || function ( merge ) {
                    return function ( base ) {
                        return merge.id == base.id
                    }
                }

                var mergeFn = arg[ 'mergeFn' ] || function ( base, merge ) {
                    Object.assign( base, merge )
                }

                if ( !merge[ prop ] ) return

                if ( base[ prop ] ) {
                    merge[ prop ].forEach( function( m ) {
                        var items = base[ prop ].filter( findFn( m ) )
                        if ( items.length > 0 ) {
                            items.forEach( function ( item ) {
                                mergeFn( item, m )
                            } )
                        }
                        else {
                            base[ prop ].push( m )
                        }
                    } )
                }
                else {
                    base[ prop ] = merge[ prop ]
                }

                delete merge[ prop ]
            }

        }

        function resolveConfig() {
            if ( !self.layers ) return

            return SMK.UTIL.waitAll( self.layers.map( function ( ly ) {
                if ( ly.type != 'esri-dynamic' ) return ly
                if ( ly.dynamicLayers ) return ly
                if ( !ly.mpcmId ) throw new Error( 'No mpcmId provided' )

                return SMK.UTIL.makePromise( function ( res, rej ) {
                    $.ajax( {
                        url: 'https://mpcm-catalogue.api.gov.bc.ca/catalogV2/PROD/' + ly.mpcmId,
                        dataType: 'xml'
                    } ).then( res, rej )
                } )
                .then( function ( data ) {
                    // debugger
                } )
                // console.log( ly )

            } ) )
        }

        function initMapFrame() {
            $( self.$container )
                .addClass( 'smk-viewer-' + self.viewer.type )

            if ( self.$option[ 'title-sel' ] )
                $( self.$option[ 'title-sel' ] ).text( self.name )

            var themes = [ 'base' ].concat( self.viewer.themes ).map( function ( th ) { return 'theme-' + th } )
            
            $( self.$container )
                .addClass( themes.map( function ( th ) { return 'smk-' + th } ).join( ' ' ) )

            self.detectDevice()

            if ( self.viewer.panelWidth )
                self.setVar( 'panel-width', self.viewer.panelWidth + 'px' )

            return include( themes )
        }

        function resolveDeviceConfig() {
            findProperty( self, 'tools', 'enabled', function ( val ) {
                if ( typeof val == 'string' ) return val == self.$device
            } )

            findProperty( self, 'tools', 'showTitle', function ( val ) {
                if ( typeof val == 'string' ) return val == self.$device
            } )

            findProperty( self, 'tools', 'control', function ( val ) {
                if ( typeof val == 'string' ) return val == self.$device
            } )
        }

        function checkTools() {
            if ( !self.tools ) return
            var enabledTools = self.tools.filter( function ( t ) { return t.enabled !== false } )
            if ( enabledTools.length == 0 ) return

            return SMK.UTIL.waitAll( enabledTools.map( function ( t ) {
                t.id = t.type + ( t.instance ? '--' + t.instance : '' )
                var tag = 'check-' + t.type
                return include( tag )
                    .then( function ( inc ) {
                        if ( inc[ tag ] && typeof( inc[ tag ] ) == 'function' )
                            return inc[ tag ]( self, t )
                    } )
                    .then( function () {
                        console.log( 'checked tool "' + t.type + '"' )
                    } )
                    .catch( function ( e ) {
                        console.debug( 'unable to check tool "' + t.type + '"', e )
                    } )
            } ) )
        }

        function loadViewer() {
            return include( 'viewer-' + self.viewer.type )
                .catch( function ( e ) {
                    e.message += ', viewer type ' + ( self.viewer.type ? '"' + self.viewer.type + '" ' : '' ) + 'is not defined'
                    throw e
                    // throw new Error( 'viewer type ' + ( self.viewer.type ? '"' + self.viewer.type + '" ' : '' ) + 'is not defined' )
                } )
        }

        function loadTools() {
            self.$tool = {}

            if ( !self.tools ) return
            var enabledTools = self.tools.filter( function ( t ) { return t.enabled !== false } )
            if ( enabledTools.length == 0 ) return

            return SMK.UTIL.waitAll( enabledTools.map( function ( t ) {
                var tag = 'tool-' + t.type
                return include( tag )
                    .then( function ( inc ) {
                        return include( tag + '-' + self.viewer.type )
                            .catch( function () {
                                console.log( 'tool "' + t.type + '" has no ' + self.viewer.type + ' subclass' )
                            } )
                            .then( function () {
                                return inc
                            } )
                    } )
                    .then( function ( inc ) {
                        var id = t.type + ( t.instance ? '--' + t.instance : '' )
                        self.$tool[ id ] = new inc[ tag ]( t )
                        self.$tool[ id ].id = id
                    } )
                    .catch( function ( e ) {
                        console.warn( 'tool "' + t.type + '" failed to create:', e )
                    } )
            } ) )
        }

        function initViewer() {
            if ( !( self.viewer.type in SMK.TYPE.Viewer ) )
                throw new Error( 'viewer type "' + self.viewer.type + '" not defined' )

            self.$viewer = new SMK.TYPE.Viewer[ self.viewer.type ]()
            return SMK.UTIL.resolved()
                .then( function () {
                    return self.$viewer.initialize( self )
                } )
                .then( function () {
                    return self.$viewer.initializeLayers( self )
                } )
        }

        function initTools() {
            var ts = Object.keys( self.$tool )
                .sort( function ( a, b ) { return self.$tool[ a ].order - self.$tool[ b ].order } )

            return SMK.UTIL.waitAll( ts.map( function ( t ) {
                return SMK.UTIL.resolved()
                    .then( function () {
                        return self.$tool[ t ].initialize( self )
                    } )
                    .catch( function ( e ) {
                        console.warn( 'tool "' + t + '" failed to initialize:', e )
                    } )
                    .then( function ( tool ) {
                        console.log( 'tool "' + t + '" initialized' )
                    } )
            } ) )
        }

        function showMap() {
            status.remove()
            spinner.remove()
            $( self.$container )
                .hide()
                .removeClass( 'smk-hidden' )
                .fadeIn( 1000 )

            if ( self.viewer.activeTool in self.$tool )
                self.$tool[ self.viewer.activeTool ].active = true
        }
    }

    SmkMap.prototype.destroy = function () {
        if ( this.$viewer )
            this.$viewer.destroy()
    }

    SmkMap.prototype.addToContainer = function ( html, attr, prepend ) {
        return $( html )[ prepend ? 'prependTo' : 'appendTo' ]( this.$container ).attr( attr || {} ).get( 0 )
    }

    SmkMap.prototype.addToOverlay = function ( html ) {
        if ( !this.$overlay )
            this.$overlay = this.addToContainer( '<div class="smk-overlay">' )

        return $( html ).appendTo( this.$overlay ).get( 0 )
    }

    SmkMap.prototype.addToStatus = function ( html ) {
        if ( !this.$status )
            this.$status = this.addToOverlay( '<div class="smk-status">' )

        return $( html ).appendTo( this.$status ).get( 0 )
    }

    SmkMap.prototype.getSidepanel = function () {
        var self = this

        if ( this.$sidepanel ) return this.$sidepanel

        this.$sidepanel = new SMK.TYPE.Sidepanel( this )

        this.$sidepanel.changedVisible( function () {
            $( self.$container ).toggleClass( 'smk-sidepanel-active', self.$sidepanel.isPanelVisible() )

            self.$viewer.mapResized()
        } )

        return this.$sidepanel
    }

    SmkMap.prototype.getVar = function ( cssVar ) {
        return $( this.$container ).css( '--' + cssVar )
    }

    SmkMap.prototype.setVar = function ( cssVar, value ) {
        return $( this.$container ).css( '--' + cssVar, value )
    }

    SmkMap.prototype.emit = function ( toolId, event, arg ) {
        this.$dispatcher.$emit( toolId + '.' + event, arg )

        return this
    }

    SmkMap.prototype.on = function ( toolId, handler ) {
        var self = this

        Object.keys( handler ).forEach( function ( k ) {
            self.$dispatcher.$on( toolId + '.' + k, handler[ k ] )
        } )

        return this
    }

    SmkMap.prototype.withTool = function ( toolId, action ) {
        var self = this

        if ( !this.$tool[ toolId ] ) return

        return action.call( this.$tool[ toolId ] )
    }

    SmkMap.prototype.detectDevice = function () {
        var dev = this.viewer.device
        if ( dev == 'auto' ) {
            var w =  $( window ).width()
            dev = w >= this.viewer.deviceAutoBreakpoint ? 'desktop' : 'mobile'
        }

        if ( dev == this.$device )
            return 

        if ( this.$device )
            $( this.$container )
                .removeClass( 'smk-device-' + this.$device )

        this.$device = dev
        
        $( this.$container )
            .addClass( 'smk-device-' + this.$device )

        return this.$device
    }

    SmkMap.prototype.showFeature = function ( acetate, geometry, opt ) {
        if ( this.$viewer.temporaryFeature )
            this.$viewer.temporaryFeature( acetate, geometry, opt )
    }
    
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function findProperty( obj, collectionName, propName, cb ) {
        if ( !( collectionName in obj ) )
            throw new Error( collectionName + ' is not in obj' )

        if ( !Array.isArray( obj[ collectionName ] ) )
            throw new Error( collectionName + ' is not an array' )

        obj[ collectionName ].forEach( function ( item ) {
            if ( !( propName in item ) ) return

            var res = cb( item[ propName ] )
            if ( res === undefined ) return

            item[ propName ] = res
        } )
    }
} )
