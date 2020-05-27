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
                }
            },
            computed: {
                title: {
                    get: function () {
                        return document.getElementsByTagName( 'title' )[ 0 ].innerText
                    }
                }
            }
        } )
    } )    

function addExample ( exampleId ) {
    var ex = {
        id: exampleId,
        url: exampleId + '.html',
        title: null,
        doc: null,
        description: null,
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
                    return '<b>' + m + '</b>'
                } )

            return vmInit.then( function ( vm ) {
                if ( ex.id == ( document.location.hash || defaultExampleId ) )
                    vm.selectExample( ex )
            } )            
        } )
        .catch( function ( err ) {
            ex.doc = 'Unable to load: ' + err
            ex.title = exampleId
        } )
}

