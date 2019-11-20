include.module( 'widget-address-search', [ 
    'widgets', 
    'widget-address-search.address-search-html'
], function ( inc ) {
    "use strict";
    
    Vue.component( 'address-search', {
        template: inc[ 'widget-address-search.address-search-html' ],
        props: [ 'value', 'placeholder' ],
        data: function () {
            return {
                search: this.value,
                list: null,
                selectedIndex: null,
                expanded: false
            }
        },
        watch: {
            value: function ( val ) {
                this.search = this.value
            }
        },
        methods: {
            onChange: function () {
                var self = this

                this.$emit( 'input', this.search )
                this.$emit( 'update', { fullAddress: this.search } )

                this.list = null

                var query = {
                    ver:            1.2,
                    maxResults:     20,
                    outputSRS:      4326,
                    addressString:  this.search,
                    autoComplete:   true
                }

                return SMK.UTIL.makePromise( function ( res, rej ) {
                    $.ajax( {
                        timeout:    10 * 1000,
                        dataType:   'jsonp',
                        url:        'https://apps.gov.bc.ca/pub/geocoder/addresses.geojsonp', 
                        data:       query,
                    } ).then( res, rej )
                } )
                .then( function ( data ) {
                    self.list = $.map( data.features, function ( feature ) {
                        if ( !feature.geometry.coordinates ) return;

                        // exclude whole province match
                        if ( feature.properties.fullAddress == 'BC' ) return;

                        return {
                            longitude:           feature.geometry.coordinates[ 0 ],
                            latitude:            feature.geometry.coordinates[ 1 ],
                            civicNumber:         feature.properties.civicNumber,
                            civicNumberSuffix:   feature.properties.civicNumberSuffix,
                            fullAddress:         feature.properties.fullAddress,
                            localityName:        feature.properties.localityName,
                            localityType:        feature.properties.localityType,
                            streetName:          feature.properties.streetName,
                            streetType:          feature.properties.streetType,
                        }
                    } )

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
                this.search = this.list[ this.selectedIndex ].fullAddress
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