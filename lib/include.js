if ( !window.include ) { ( function () {
    "use strict";

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var TAG = {}
    var OPTION = {
        baseUrl: document.location,
        timeout: 60 * 1000
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function includeTag( tag, attr ) {
        if ( !attr ) {
            if ( !TAG[ tag ] ) throw new Error( 'tag "' + tag + '" not defined' )

            return TAG[ tag ]
        }

        if ( tag in TAG )
            throw new Error( 'tag "' + tag + '" already defined' )

        TAG[ tag ] = attr
        return attr
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function option( option ) {
        if ( typeof option == 'string' ) return OPTION[ option ]
        Object.assign( OPTION, option )
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var loader = {}

    loader.$resolveUrl = function ( url ) {
        if ( /^[.][/]/.test( url ) ) return url

        return ( new URL( url, OPTION.baseUrl ) ).toString()
    }

    loader.tags = function ( inc ) {
        return this.template( inc )
            .then( function ( data ) {
                var tagData = JSON.parse( data )
                var tags = Object.keys( tagData )
                tags.forEach( function ( t ) {
                    includeTag( t, tagData[ t ] )
                } )
                return tagData
            } )
    }

    loader.script = function ( inc ) {
        var self = this

        if ( inc.load ) {
            return new Promise( function ( res, rej ) {
                res( inc.load.call( window ) )
            } )
        }
        else if ( inc.url ) {
            return new Promise( function ( res, rej ) {
                var script = document.createElement( 'script' )

                if ( inc.integrity ) {
                    script.setAttribute( 'integrity', inc.integrity )
                    script.setAttribute( 'crossorigin', '' )
                }

                script.addEventListener( 'load', function( ev ) {
                    res( script )
                } )

                script.addEventListener( 'error', function( ev ) {
                    rej( new Error( 'failed to load script from ' + script.src ) )
                } )

                script.setAttribute( 'src', self.$resolveUrl( inc.url ) )

                document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
            } )
        }
        else throw new Error( 'Can\'t load script' )
    }

    loader.style = function ( inc ) {
        var self = this

        return new Promise( function ( res, rej ) {
            var style
            if ( inc.load ) {
                style = document.createElement( 'style' )
                style.textContent = inc.load
                res( style )
            }
            else {
                style = document.createElement( 'link' )

                style.setAttribute( 'rel', 'stylesheet' )

                if ( inc.integrity ) {
                    style.setAttribute( 'integrity', inc.integrity )
                    style.setAttribute( 'crossorigin', '' )
                }

                style.addEventListener( 'load', function( ev ) {
                    res( style )
                } )

                style.addEventListener( 'error', function( ev ) {
                    rej( new Error( 'failed to load stylesheet from ' + style.href ) )
                } )

                if ( inc.url ) {
                    style.setAttribute( 'href', self.$resolveUrl( inc.url ) )
                }
                else {
                    rej( new Error( 'Can\'t load style' ) )
                }
            }

            document.getElementsByTagName( 'head' )[ 0 ].appendChild( style );
        } )
    }

    loader.template = function ( inc ) {
        var self = this

        if ( inc.load ) {
            return new Promise( function ( res, rej ) {
                res( inc.data = inc.load )
            } )
        }
        else if ( inc.url ) {
            return new Promise( function ( res, rej ) {
                var req = new XMLHttpRequest()
                var url = self.$resolveUrl( inc.url )

                req.addEventListener( 'load', function () {
                    if ( this.status != 200 ) rej( new Error( 'status ' + this.status + ' trying to load template from ' + url ) )
                    res( inc.data = this.responseText )
                } )

                req.addEventListener( 'error', function ( ev ) {
                    rej( new Error( 'failed to load template from ' + url ) )
                } )

                req.open( 'GET', url )
                req.send()
            } )
        }
        else throw new Error( 'Can\'t load template' )
    }

    loader.sequence = function ( inc, tag ) {
        inc.tags.forEach( function ( t, i, a ) {
            a[ i ] = _assignAnonTag( t, tag )
        } )

        // console.group( tag, 'sequence', JSON.stringify( inc.tags ) )

        var promise = Promise.resolve()
        var res = {}

        inc.tags.forEach( function ( t ) {
            promise = promise.then( function () {
                return _include( t )
            } )
            .then( function ( r ) {
                res[ t ] = r
            } )
        } )

        return promise.then( function () {
            // console.groupEnd()
            return res
        } )
    }

    loader.group = function ( inc, tag ) {
        inc.tags.forEach( function ( t, i, a ) {
            a[ i ] = _assignAnonTag( t, tag )
        } )

        // console.group( tag, 'group', JSON.stringify( inc.tags ) )

        var promises = inc.tags.map( function ( t ) {
            return Promise.resolve().then( function () { return _include( t ) } )
        } )

        return Promise.all( promises )
            .then( function ( ress ) {
                // console.groupEnd()
                var res = {}
                inc.tags.forEach( function ( t, i ) {
                    res[ t ] = ress[ i ]
                } )
                return res
            } )
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function include( tags ) {
        if ( !Array.isArray( tags ) )
            tags = [].slice.call( arguments )

        // return loader.group( { tags: tags } )
        return loader.sequence( { tags: tags } )
    }

    var extLoader = {
        js: 'script',
        css: 'style',
        html: 'template'
    }

    function _assignAnonTag( tag, base ) {
        if ( typeof tag == 'string' ) return tag

        var anon = tag
        var newTag
        if ( base && tag.url && !tag.external && !/[/][/]/.test( tag.url ) ) {
            var m = tag.url.match( /(^|[/])([^/]+)$/ )
            newTag = base + '.' +  m[ 2 ].replace( /[.]/g, '-' ).toLowerCase()
        }
        else {
            newTag = 'anon-' + hash( anon )
        }

        try {
            var inc = includeTag( newTag )
            console.warn( 'tag "' + newTag + '" already defined as', inc, ', will be used instead of', tag )
        }
        catch ( e ) {
            includeTag( newTag, anon )
        }

        return newTag
    }

    function _include( tag ) {
        var inc = includeTag( _assignAnonTag( tag ) )

        if ( inc.include ) return inc.include

        if ( !inc.loader ) {
            var ext = inc.url.match( /[.]([^.]+)$/ )
            if ( ext ) inc.loader = extLoader[ ext[ 1 ] ]
        }

        if ( !loader[ inc.loader ] ) throw new Error( 'tag "' + tag + '" has unknown loader "' + inc.loader + '"' )

        return ( inc.include = new Promise( function ( res, rej ) {
                loader[ inc.loader ].call( loader, inc, tag )
                    .then( function ( r ) {
                        inc.loaded = r

                        if ( !inc.module ) return r

                        return inc.module
                    } )
                    .then( res, rej )

                setTimeout( function () {
                    rej( new Error( 'timeout' ) )
                }, OPTION.timeout )
            } )
            .then( function ( res ) {
                console.debug( 'included ' + inc.loader + ' "' + tag + '"', inc.url || inc.tags )
                return res
            } )
            .catch( function ( e ) {
                e.message += ', for tag "' + tag + '"'
                console.warn(e)

                throw e
            } ) )
    }

    function module( tag, incs, mod ) {
        var inc
        try {
            inc = includeTag( tag )
        }
        catch ( e ) {
            console.warn( 'tag "' + tag + '" for module not defined, creating' )
            inc = includeTag( tag, {} )
        }

        if ( inc.module )
            console.warn( 'tag "' + tag + '" for module already defined, overwriting' )

        var deps
        if ( incs )
            deps = include( incs )
        else
            deps = Promise.resolve()

        return ( inc.module = deps
            .then( function ( res ) {
                if ( typeof mod == 'function' )
                    return mod.call( inc, res )

                return mod
            } )
            .then( function ( exp ) {
                console.debug( 'module "' + tag + '"' )
                inc.exported = exp
                return exp
            } ) )
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * Modified from http://stackoverflow.com/a/22429679
     *
     * Calculate a 32 bit FNV-1a hash
     * Found here: https://gist.github.com/vaiorabbit/5657561
     * Ref.: http://isthe.com/chongo/tech/comp/fnv/
     *
     * @param {any} val the input value
     * @returns {string}
     */
    var typeCode = {
        undefined:  '\x00',
        null:       '\x01',
        boolean:    '\x02',
        number:     '\x03',
        string:     '\x04',
        function:   '\x05',
        array:      '\x06',
        object:     '\x0a'
    };

    function type( val ) {
        var t = typeof val
        if ( t != 'object' ) return t
        if ( Array.isArray( val ) ) return 'array'
        if ( val === null ) return 'null'
        return 'object'
    }

    function hash( val ) {
        /* jshint bitwise: false */

        var h = 0x811c9dc5;

        walk( val );

        return ( "0000000" + ( h >>> 0 ).toString( 16 ) ).substr( -8 );

        function walk( val ) {
            var t = type( val );

            switch ( t ) {
            case 'string':
                return addBits( val );

            case 'array':
                addBits( typeCode[ t ] );

                for ( var j1 in val )
                    walk( val[ j1 ] )

                return;

            case 'object':
                addBits( typeCode[ t ] );

                var keys = Object.keys( val ).sort();
                for ( var j2 in keys ) {
                    var key = keys[ j2 ];
                    addBits( key );
                    walk( val[ key ] );
                }
                return;

            case 'undefined':
            case 'null':
                return addBits( typeCode[ t ] )

            default:
                return addBits( typeCode[ t ] + String( val ) )
            }
        }

        function addBits( str ) {
            for ( var i = 0, l = str.length; i < l; i += 1 ) {
                h ^= str.charCodeAt(i);
                h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
            }
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    window.include = include
    window.include.module = module
    window.include.tag = includeTag
    window.include.hash = hash
    window.include.option = option

} )() }

