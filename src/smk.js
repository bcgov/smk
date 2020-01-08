( function () {
    "use strict";

    function isIE() {
        return navigator.userAgent.indexOf( "MSIE " ) > -1 || navigator.userAgent.indexOf( "Trident/" ) > -1;
    }

    var documentReadyPromise
    var bootstrapScriptEl = document.currentScript

    try {
        if ( isIE() )
            throw new Error( 'SMK will not function in Internet Explorer 11. Use Google Chrome, or Microsoft Edge, or Firefox, or Safari.' )

        var util = {}
        installPolyfills( util )
        setupGlobalSMK( util )
    }
    catch ( e ) {
        setTimeout( function () {
            document.querySelector( 'body' ).appendChild( failureMessage( e ) )
        }, 1000 )
    }

    SMK.INIT = function ( option ) {
        var scriptEl = bootstrapScriptEl

        if ( option ) {
            scriptEl = {
                src: scriptEl.src,
                attributes: Object.keys( option ).reduce( function ( acc, key ) {
                    acc[ key ] = { value: option[ key ] }
                    return acc
                }, {} )
            }
        }

        try {
            var timer
            SMK.BOOT = SMK.BOOT
                .then( function () { return scriptEl } )
                .then( parseScriptElement )
                .then( function ( attr ) {
                    timer = 'SMK initialize ' + attr.id
                    console.time( timer )
                    return attr
                } )
                .then( resolveConfig )
                .then( initializeSmkMap )
                .catch( SMK.ON_FAILURE )

            util.promiseFinally( SMK.BOOT, function () {
                console.timeEnd( timer )
            } )

            return SMK.BOOT
        }
        catch ( e ) {
            setTimeout( function () {
                document.querySelector( 'body' ).appendChild( failureMessage( e ) )
            }, 1000 )
        }
    }

    if ( bootstrapScriptEl && bootstrapScriptEl.attributes && bootstrapScriptEl.attributes[ 'smk-container-sel' ] ) 
        SMK.INIT()

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function parseScriptElement( scriptEl ) {

        var smkAttr = {
            'id':           attrString( '1' ),
            'container-sel':attrString( '#smk-map-frame' ),
            // 'title-sel':    attrString( 'head title' ),
            'config':       attrList( '?smk-' ),
            'base-url':     attrString( ( new URL( scriptEl.src.replace( 'smk.js', '' ), document.location ) ).toString() ),
            'service-url':  attrString( null, null ),
        }

        Object.keys( smkAttr ).forEach( function ( k ) {
            smkAttr[ k ] = smkAttr[ k ]( 'smk-' + k, scriptEl )
        } )

        console.log( 'SMK attributes', JSON.parse( JSON.stringify( smkAttr ) ) )

        return Promise.resolve( smkAttr )

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        function attrString( missingKey, missingValue ) {
            if ( missingValue === undefined )
                missingValue = missingKey

            return function( key, el ) {
                var val = el.attributes[ key ]
                if ( val == null ) return missingKey
                if ( !val.value ) return missingValue
                return val.value
            }
        }

        function attrList( Default ) {
            return function( key, el ) {
                var val = attrString( Default )( key, el )
                if ( Array.isArray( val ) ) return val 
                return val.split( /\s*[|]\s*/ ).filter( function ( i ) { return !!i } )
            }
        }

        function attrBoolean( missingKey, missingValue ) {
            /* jshint evil: true */

            return function( key, el ) {
                var val = attrString( missingKey, missingValue )( key, el )
                return !!eval( val )
            }
        }
    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function resolveConfig( attr ) {
        var configs = []
        attr.config.forEach( function ( c, i ) {
            var source = 'attr[' + i + ']'
            configs = configs.concat( parseObject( c, source ) || parseDocumentArguments( c, source ) || parseLiteralJson( c, source ) || parseOption( c, source ) || parseUrl( c, source ) )
        } )

        attr.config = configs

        return attr
    }

    function parseObject( config, source ) {
        if ( typeof config != 'object' || Array.isArray( config ) || config === null ) return

        config.$sources = [ source + ' -> obj' ]
        return config
    }

    function parseDocumentArguments( config, source ) {
        if ( !/^[?]/.test( config ) ) return

        var paramPattern = new RegExp( '^' + config.substr( 1 ) + '(.+)$', 'i' )

        var params = location.search.substr( 1 ).split( '&' )
        var configs = []
        params.forEach( function ( p, i ) {
            var source1 = source + ' -> arg[' + config + ',' + i + ']'
            try {
                var m = decodeURIComponent( p ).match( paramPattern )
                if ( !m ) return

                configs = configs.concat( parseOption( m[ 1 ], source1 ) || [] )
            }
            catch ( e ) {
                if ( !e.parseSource ) e.parseSource = source1
                throw e
            }
        } )

        return configs
    }

    function parseLiteralJson( config, source ) {
        if ( !/^[{].+[}]$/.test( config ) ) return

        source += ' -> json'
        try {
            var obj = JSON.parse( config )
            obj.$sources = [ source ]

            return obj
        }
        catch ( e ) {
            if ( !e.parseSource ) e.parseSource = source
            throw e
        }
    }

    function parseOption( config, source ) {
        var m = config.match( /^(.+?)([=](.+))?$/ )
        if ( !m ) return

        var option = m[ 1 ].toLowerCase()
        if ( !( option in optionHandler ) ) return

        source += ' -> option[' + option + ']'
        try {
            var obj = optionHandler[ option ]( m[ 3 ], source )
            if ( !obj.$sources )
                obj.$sources = [ source ]

            return obj
        }
        catch ( e ) {
            if ( !e.parseSource ) e.parseSource = source
            throw e
        }
    }

    function parseUrl( config, source ) {
        source += ' -> url[' + config + ']'
        var obj = {
            url: config,
            $sources: [ source ]
        }

        return obj
    }

    var optionHandler = {
        'config': function ( arg, source ) {
            return parseLiteralJson( arg, source ) || parseUrl( arg, source )
        },

        'theme': function ( arg, source ) {
            var args = arg.split( ',' )
            if ( args.length != 1 ) throw new Error( '-theme needs at least 1 argument' )
            return {
                viewer: {
                    themes: args
                }
            }
        },

        'device': function ( arg, source ) {
            var args = arg.split( ',' )
            if ( args.length != 1 ) throw new Error( '-device needs 1 argument' )
            return {
                viewer: {
                    device: args[ 0 ]
                }
            }
        },

        'extent': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length != 4 ) throw new Error( '-extent needs 4 arguments' )
            return {
                viewer: {
                    location: {
                        extent: args,                        
                        center: null,
                        zoom: null,
                    }
                }
            }
        },

        'center': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 2 || args.length > 3 ) throw new Error( '-center needs 2 or 3 arguments' )

            var loc = {
                center: [ args[ 0 ], args[ 1 ] ],
            }

            if ( args[ 2 ] )
                loc.zoom = args[ 2 ]

            return {
                viewer: {
                    location: loc 
                }
            }
        },

        'viewer': function ( arg ) {
            return {
                viewer: {
                    type: arg
                }
            }
        },

        'active-tool': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length != 1 && args.length != 2 ) throw new Error( '-active-tool needs 1 or 2 arguments' )

            var toolId = args[ 0 ]
            if ( args[ 1 ] )
                toolId += '--' + args[ 1 ]

            return {
                viewer: {
                    activeTool: toolId
                }
            }
        },

        'query': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 3 ) throw new Error( '-query needs at least 3 arguments' )

            var queryId = 'query-' + arg.replace( /[^a-z0-9]+/ig, '-' ).replace( /(^[-]+)|([-]+$)/g, '' ).toLowerCase()

            var layerId = args[ 0 ]
            var conj = args[ 1 ].trim().toLowerCase()
            if ( conj != 'and' && conj != 'or' ) throw new Error( '-query conjunction must be one of: AND, OR' )

            var parameters = []
            function constant( value ) {
                var id = 'constant' + ( parameters.length + 1 )
                parameters.push( {
                    id: id,
                    type: 'constant',
                    value: JSON.parse( value )
                } )
                return id
            }

            var clauses = args.slice( 2 ).map( function ( p ) {
                var m = p.trim().match( /^(\w+)\s*([$^]?~|=|<=?|>=?)\s*(.+?)$/ )
                if ( !m ) throw new Error( '-query expression is invalid' )

                var args = [
                    { operand: 'attribute', name: m[ 1 ] },
                    { operand: 'parameter', id: constant( m[ 3 ] ) }
                ]

                switch ( m[ 2 ].toLowerCase() ) {
                    case '~':  return { operator: 'contains', arguments: args }
                    case '^~': return { operator: 'starts-with', arguments: args }
                    case '$~': return { operator: 'ends-with', arguments: args }
                    case '=':  return { operator: 'equals', arguments: args }
                    case '>':  return { operator: 'greater-than', arguments: args }
                    case '<':  return { operator: 'less-than', arguments: args }
                    case '>=': return { operator: 'not', arguments: [ { operator: 'less-than', arguments: args } ] }
                    case '<=': return { operator: 'not', arguments: [ { operator: 'greater-than', arguments: args } ] }
                }
            } )

            return {
                viewer: {
                    activeTool: 'query--' + layerId + '--' + queryId,
                },
                tools: [ {
                    type: 'query',
                    instance: layerId + '--' + queryId,
                    onActivate: 'execute'
                } ],
                layers: [ {
                    id: layerId,
                    queries: [ {
                        id: queryId,
                        parameters: parameters,
                        predicate: {
                            operator: conj,
                            arguments: clauses
                        }
                    } ]
                } ]
            }
        },

        'layer': function ( arg, source ) {
            var args = arg.split( ',' )
            if ( args.length < 2 ) throw new Error( '-layer needs at least 2 arguments' )

            var layerId = 'layer-' + arg.replace( /[^a-z0-9]+/ig, '-' ).replace( /(^[-]+)|([-]+$)/g, '' ).toLowerCase()

            var type = args[ 0 ].trim().toLowerCase()
            switch ( type ) {
                case 'esri-dynamic':
                    if ( args.length < 3 ) throw new Error( '-layer=esri-dynamic needs at least 3 arguments' )
                    return {
                        layers: [ {
                            id:         layerId,
                            type:       'esri-dynamic',
                            isVisible:  true,
                            serviceUrl: args[ 1 ],
                            mpcmId:     args[ 2 ],
                            title:      args[ 3 ] || ( 'ESRI Dynamic ' + args[ 2 ] ),
                        } ]
                }

                case 'wms':
                    if ( args.length < 3 ) throw new Error( '-layer=wms needs at least 3 arguments' )
                    return {
                        layers: [ {
                            id:         layerId,
                            type:       'wms',
                            isVisible:  true,
                            serviceUrl: args[ 1 ],
                            layerName:  args[ 2 ],
                            styleName:  args[ 3 ],
                            title:      args[ 4 ] || ( 'WMS ' + args[ 2 ] ),
                        } ]
                }

                case 'vector':
                    return {
                        layers: [ {
                            id:         layerId,
                            type:       'vector',
                            isVisible:  true,
                            dataUrl:    args[ 1 ],
                            title:      args[ 2 ] || ( 'Vector ' + args[ 1 ] ),
                        } ]
                    }

                default: throw new Error( 'unknown layer type: ' + type )
            }
        },

        'show-tool': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 1 ) throw new Error( '-show-tool needs at least 1 argument' )

            return {
                tools: args.map( function ( type ) {
                    if ( type == 'all' ) type = '*'
                    return {
                        type: type,
                        enabled: true
                    }
                } )
            }
        },

        'hide-tool': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 1 ) throw new Error( '-hide-tool needs at least 1 argument' )

            return {
                tools: args.map( function ( type ) {
                    if ( type == 'all' ) type = '*'
                    return {
                        type: type,
                        enabled: false
                    }
                } )
            }
        },

        'show-layer': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 1 ) throw new Error( '-show-layer needs at least 1 argument' )

            return {
                layers: args.map( function ( id ) {
                    if ( id == 'all' ) id = '**'
                    return {
                        id: id,
                        isVisible: true
                    }
                } )
            }
        },

        'hide-layer': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 1 ) throw new Error( '-hide-layer needs at least 1 argument' )

            return {
                layers: args.map( function ( id ) {
                    if ( id.toLowerCase() == 'all' ) id = '**'
                    return {
                        id: id,
                        isVisible: false
                    }
                } )
            }
        },

        'storage': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length < 1 ) throw new Error( '-storage needs at least 1 argument' )

            return args.map( function ( key ) {
                return JSON.parse( window.sessionStorage.getItem( key ) )
            } )
        },

        // Options below are for backward compatibility with DMF

        'll': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length != 2 ) throw new Error( '-ll needs 2 arguments' )

            return {
                viewer: {
                    location: {
                        center: [ args[ 0 ], args[ 1 ] ]
                    }
                }
            }
        },

        'z': function ( arg ) {
            var args = arg.split( ',' )
            if ( args.length != 1 ) throw new Error( '-z needs 1 argument' )

            return {
                viewer: {
                    location: {
                        zoom: args[ 0 ]
                    }
                }
            }
        },

    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function initializeSmkMap( attr ) {
        include.option( { baseUrl: attr[ 'base-url' ] } )

        return whenDocumentReady()
            .then( function () {
                if ( window.jQuery ) {
                    include.tag( 'jquery' ).include = Promise.resolve( window.jQuery )
                    return
                }

                return include( 'jquery' )
            } )
            .then( function () {
                if ( window.Vue ) {
                    include.tag( 'vue' ).include = Promise.resolve( window.Vue )
                    return
                }

                return include( 'vue' )
            } )
            .then( function () {
                return include( 'vue-config' )
            } )
            .then( function () {
                if ( window.turf ) {
                    include.tag( 'turf' ).include = Promise.resolve( window.turf )
                    return
                }

                return include( 'turf' )
            } )
            .then( function () {
                return include( 'smk-map' ).then( function ( inc ) {
                    if ( attr[ 'id' ] in SMK.MAP )
                        throw new Error( 'An SMK map with smk-id "' + attr[ 'id' ] + '" already exists' )

                    var map = SMK.MAP[ attr[ 'id' ] ] = new SMK.TYPE.SmkMap( attr )
                    return map.initialize()
                } )
            } )
    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function whenDocumentReady() {
        if ( documentReadyPromise ) return documentReadyPromise

        return ( documentReadyPromise = new Promise( function ( res, rej ) {
            if ( document.readyState != "loading" )
                return res()

            document.addEventListener( "DOMContentLoaded", function( ev ) {
                clearTimeout( id )
                res()
            } )

            var id = setTimeout( function () {
                console.error( 'timeout waiting for document ready' )
                rej()
            }, 20000 )
        } ) )
    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function installPolyfills( util ) {
        window.dojoConfig = {
            has: {
                "esri-promise-compatibility": 1
            }
        }

        // - - - - - - - - - - - - - - - - - - - - -
        // document.currentScript polyfill for IE11
        // - - - - - - - - - - - - - - - - - - - - -
        if ( !document.currentScript ) ( function() {
            var scripts = document.getElementsByTagName( 'script' )
            // document._currentScript = document.currentScript

            // return script object based off of src
            var getScriptFromURL = function( url ) {
                // console.log( url )
                for ( var i = 0; i < scripts.length; i += 1 )
                    if ( scripts[ i ].src == url ) {
                        // console.log( scripts[ i ] )
                        return scripts[ i ]
                    }
            }

            var actualScript = document.actualScript = function() {
                /* jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
                /* jshint -W117 */ // omgwtf is not defined

                var stack
                try {
                    omgwtf
                } catch( e ) {
                    stack = e.stack
                }

                if ( !stack ) return

                var entries = stack.split( /\s+at\s+/ )
                var last = entries[ entries.length - 1 ]

                var m = last.match( /[(](.+?)(?:[:]\d+)+[)]/ )
                if ( m )
                    return getScriptFromURL( m[ 1 ] )
            }

            if ( document.__defineGetter__ )
                document.__defineGetter__( 'currentScript', actualScript )
        } )()


        if ( Promise.prototype.finally )
            util.promiseFinally = function ( promise, onFinally ) {
                return promise.finally( onFinally )
            }
        else
            util.promiseFinally = function ( promise, onFinally ) {
                var onThen = function ( arg ) {
                    onFinally()
                    return arg
                }

                var onFail = function ( arg ) {
                    onFinally()
                    return Promise.reject( arg )
                }

                return promise.then( onThen, onFail )
            }

    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function setupGlobalSMK( util ) {
        return ( window.SMK = Object.assign( {
            MAP: {},
            VIEWER: {},
            TYPE: {},
            UTIL: util,

            CONFIG: {
                name: 'SMK Default Map',
                viewer: {
                    type: "leaflet",
                    device: "auto",
                    deviceAutoBreakpoint: 500,
                    themes: [],
                    location: {
                        extent: [ -139.1782, 47.6039, -110.3533, 60.5939 ],
                    },
                    baseMap: 'Topographic',
                    clusterOption: {
                        showCoverageOnHover: false
                    }
                },
                tools: [
                    { type: 'about',        enabled: false, order: 1, position: 'list-menu',                        icon: 'help',           title: 'About SMK' },
                    { type: 'baseMaps',     enabled: false, order: 3, position: [ 'shortcut-menu', 'list-menu' ],   icon: 'map',            title: 'Base Maps' },
                    { type: 'coordinate',   enabled: false, order: 3 },
                    { type: 'directions',   enabled: false, order: 4, position: [ 'shortcut-menu', 'list-menu' ],   icon: 'directions_car', title: 'Route Planner' },
                    // { type: 'dropdown',     enabled: false }, -- so it won't be enabled by show-tools=all, no tools use it by default
                    { type: 'identify',     enabled: false, order: 5, position: 'list-menu',                        icon: 'info_outline',   title: 'Identify Results' },
                    { type: 'layers',       enabled: false, order: 3, position: [ 'shortcut-menu', 'list-menu' ],   icon: 'layers',         title: 'Layers' },
                    { type: 'list-menu',    enabled: false },
                    { type: 'location',     enabled: true },
                    { type: 'markup',       enabled: true,  order: 3 },
                    { type: 'measure',      enabled: false, order: 6, position: [ 'shortcut-menu', 'list-menu' ],   icon: 'straighten',     title: 'Measurement' },
                    // { type: 'menu',         enabled: false }, -- so it won't be enabled by show-tools=all, no tools use it by default
                    { type: 'minimap',      enabled: false, order: 1 },
                    { type: 'pan',          enabled: false },
                    // { type: 'query',        enabled: false }, -- so it won't be enabled by show-tools=all, as it needs an instance
                    { type: 'scale',        enabled: false, order: 2 },
                    { type: 'search',       enabled: true,  order: 2, position: 'toolbar',                          icon: 'search',         title: 'Search for Location' },
                    { type: 'select',       enabled: false, order: 6, position: 'list-menu',                        icon: 'select_all',     title: 'Selected Features' },
                    { type: 'shortcut-menu',enabled: false, order: 10 },
                    { type: 'toolbar',      enabled: true },
                    // { type: 'version',      enabled: false }, -- so it won't be enabled by show-tools=all
                    { type: 'zoom',         enabled: false, order: 1 }
                ]
            },

            BOOT: Promise.resolve(),
            TAGS_DEFINED: false,
            ON_FAILURE: function ( e ) {
                whenDocumentReady().then( function () {
                    document.querySelector( 'body' ).appendChild( failureMessage( e ) )
                } )
            },

            BUILD: {
                commit:     '<%= gitinfo.local.branch.current.SHA %>',
                branch:     '<%= gitinfo.local.branch.current.name %>',
                lastCommit: '<%= gitinfo.local.branch.current.lastCommitTime %>'.replace( /^"|"$/g, '' ),
                origin:     '<%= gitinfo.remote.origin.url %>',
                version:    '<%= package.version %>',
            },

            HANDLER: {
                handler: {},
                set: function ( id, method, handler ) {
                    if ( !this.handler[ id ] ) this.handler[ id ] = {}
                    this.handler[ id ][ method ] = handler 
                },
                get: function ( id, method ) {
                    if ( this.handler[ id ] && this.handler[ id ][ method ] ) return this.handler[ id ][ method ]

                    return function () {
                        console.warn( 'handler ' + id + '.' + method + ' invoked' )
                    }
                },
                has: function ( id, method ) {
                    return !!( this.handler[ id ] && this.handler[ id ][ method ] ) 
                }
            }

        }, window.SMK ) )
    }

    function failureMessage( e ) {
        if ( e.parseSource )
            e.message += ',\n  while parsing ' + e.parseSource

        console.error( e )

        var message = document.createElement( 'div' )
        message.innerHTML = '\
            <div style="\
                display:flex;\
                flex-direction:column;\
                justify-content:center;\
                align-items:center;\
                border: 5px solid red;\
                padding: 20px;\
                margin: 20px;\
                position: absolute;\
                top: 0;\
                left: 0;\
                right: 0;\
                bottom: 0;\
            ">\
                <h1>SMK Client</h1>\
                <h2>Initialization failed</h2>\
                <pre style="white-space: normal">{}</pre>\
            </div>\
        '.replace( /\s+/g, ' ' ).replace( '{}', e || '' )

        return message
    }

} )();

