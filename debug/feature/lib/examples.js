var pageExampleId = document.location.hash.substr( 1 )

var examples = []
var defaultExampleId

var m = document.currentScript.src.match( /^(.+[/])/ )
var templateUrl = ( new URL( 'examples.html', m[ 0 ] ) ).toString()

var vmInit = fetch( templateUrl )
    .then( function ( resp ) {
        if ( !resp.ok ) throw new Error( 'fetching ' + templateUrl + ' failed' )
        return resp.text()
    } )
    .then( function ( out ) {
        return new Vue( {
            el: '#app',
            template: out,
            data: {
                selectedExample: null,
                examples: examples
            },
            methods: {
                selectExample: function ( example ) {
                    this.selectedExample = example
                    document.location.hash = example.id 

                    this.$nextTick( function () {
                        document.getElementById( 'sourceFocus' ).scrollIntoView( true )
                    } )
                }
            },
            computed: {
                title: {
                    get: function () {
                        return document.getElementsByTagName( 'title' )[ 0 ].innerText
                    }
                },
                selectedExampleURL: {
                    get: function () {
                        if ( !this.selectedExample ) return
                        if ( this.selectedExample.parameters )
                            return this.selectedExample.url + '?' + this.selectedExample.parameters
                        return this.selectedExample.url
                    }
                }
            }
        } )
    } )    

function addExample ( exampleId, parameters ) {
    var ex = {
        id:         exampleId,
        url:        exampleId + '.html',
        parameters: parameters,
        title:      null,
        doc:        null
    }
    examples.push( ex )
    if ( !defaultExampleId ) defaultExampleId = exampleId

    fetch( ex.url )
        .then( function ( resp ) {
            if ( !resp.ok ) throw new Error( 'fetching ' + ex.url + ' failed' )
            return resp.text()
        } )
        .then( function ( out ) {
            var m = out.match( /title[>](.+)[<][/]title/ )
            if ( m ) ex.title = m[ 1 ]

            ex.doc = out
                .replace( /[<]/g, '&lt;' )
                .replace( /[>]/g, '&gt;' )
                .replace( /[&]lt[;][!][-][-][*]{3,}[^\0]+[*]{3,}[-][-][&]gt[;]/, function ( m ) {
                    return '<b id="sourceFocus">' + m + '</b>'
                } )

            return vmInit.then( function ( vm ) {
                if ( ex.id == ( pageExampleId || defaultExampleId ) )
                    vm.selectExample( ex )
            } )            
        } )
        .catch( function ( err ) {
            ex.doc = 'Unable to load: ' + err
            ex.title = exampleId
        } )
}
