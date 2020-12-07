include.module( 'component-address-search', [ 
    'component', 
    'component-enter-input',
    'component-address-search.component-address-search-html',
    'api'
], function ( inc ) {
    "use strict";
    
    Vue.component( 'address-search', {
        template: inc[ 'component-address-search.component-address-search-html' ],
        props: {
            placeholder:    { type: String },
            geocoderService:{ type: Object, default: function () { return {} } }
        },
        data: function () {
            return {
                search: '', 
                list: null,
                selectedIndex: null,
                expanded: false,
                geocoder: new SMK.TYPE.Geocoder( this.geocoderService )
            }
        },
        methods: {
            clear: function () {
                this.search = ''
            },
            onChange: function ( val ) {
                var self = this

                this.search = val
                this.list = null

                return this.geocoder.fetchAddresses( val, { maxResults: 5 } )
                    .then( function ( features ) {
                        self.list = features
                        self.expanded = self.list.length > 0
                        self.selectedIndex = self.list.length > 0 ? 0 : null
                    } )
            },

            onArrowDown: function () {
                if ( !this.expanded && this.list ) {
                    this.expanded = true
                    this.selectedIndex = 0
                    return
                }
                this.selectedIndex = ( ( this.selectedIndex || 0 ) + 1 ) % this.list.length
            },

            onArrowUp: function () {
                if ( !this.expanded ) return
                this.selectedIndex = ( ( this.selectedIndex || 0 ) + this.list.length - 1 ) % this.list.length
            },

            onEnter: function () {
                if ( !this.expanded ) return
                this.expanded = false
                this.$emit( 'update', this.list[ this.selectedIndex ] )
            },

            handleClickOutside: function ( ev ) {
                if ( this.$el.contains( ev.target ) ) return

                this.expanded = false
                this.selectedIndex = null
            }
        },
        mounted: function () {
            document.addEventListener( 'click', this.handleClickOutside )
        },
        destroyed: function () {
            document.removeEventListener( 'click', this.handleClickOutside )
        }
    } )

} )