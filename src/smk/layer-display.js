include.module( 'layer-display', [ 'jquery', 'util', 'event' ], function () {
    "use strict";

    function LayerDisplay( option, forceVisible ) {
        Object.assign( this, {
            id:         null,
            type:       null,
            // opacity:    1,
            title:      null,
            isVisible:  true,
            isActuallyVisible: null,
            isEnabled:  true,
            inFilter:   true,
            showLegend: false,
            legends:    null
        }, option )

        if ( forceVisible )
            this.isVisible = true
    }

    SMK.TYPE.LayerDisplay = LayerDisplay
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayerDisplay.layer = function ( option, layerCatalog, forceVisible ) {
        if ( !option.id )
            throw new Error( 'display layer needs id' )

        if ( !( option.id in layerCatalog ) ) {
            console.warn( 'layer id "' + option.id + '" isn\'t defined' )
            option.isEnabled = false

            if ( !option.title )
                option.title = option.id

            option.isVisible = false
        }
        else {
            var ly = layerCatalog[ option.id ]

            // if ( !option.opacity )
            //     option.opacity = ly.config.opacity 

            if ( !option.title )
                option.title = ly.config.title 

            if ( !( 'isVisible' in option ) )
                option.isVisible = ly.config.isVisible 
        }

        LayerDisplay.prototype.constructor.call( this, option, forceVisible )
    }

    $.extend( LayerDisplay.layer.prototype, LayerDisplay.prototype )

    LayerDisplay.layer.prototype.each = function ( callback, parents ) {
        if ( !this.isEnabled ) return

        if ( callback )
            callback( this, parents )
    }

    LayerDisplay.layer.prototype.getLegends = function ( layerCatalog, viewer ) {
        if ( !this.isEnabled ) return SMK.UTIL.resolved()

        return layerCatalog[ this.id ].getLegends( viewer )
    }

    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayerDisplay.folder = function ( option, layerCatalog, forceVisible ) {
        if ( !option.id )
            option.id = SMK.UTIL.makeId( option.type, option.title ) 

        if ( !option.title )
            option.title = option.id

        LayerDisplay.prototype.constructor.call( this, option, forceVisible )

        forceVisible = forceVisible || this.type == 'group'

        this.items = option.items.map( function ( item ) {
            return createLayerDisplay( item, layerCatalog, forceVisible )
        } )
    }

    $.extend( LayerDisplay.folder.prototype, LayerDisplay.prototype )

    LayerDisplay.folder.prototype.each = function ( callback, parents ) {
        if ( !parents ) parents = []

        var doChildren
        if ( callback )
            doChildren = callback( this, parents )

        var p = [ this ].concat( parents )

        if ( doChildren !== false )        
            this.items.forEach( function ( item ) {
                item.each( callback, p )
            } )
    }

    LayerDisplay.folder.prototype.getLegends = function ( layerCatalog, viewer ) {
        return SMK.UTIL.resolved()
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayerDisplay.group = function ( option, layerCatalog, forceVisible ) {
        LayerDisplay.folder.prototype.constructor.call( this, option, layerCatalog, forceVisible )
    }

    $.extend( LayerDisplay.group.prototype, LayerDisplay.folder.prototype )

    LayerDisplay.group.prototype.getLegends = function ( layerCatalog, viewer ) {
        if ( !this.isEnabled ) return

        return SMK.UTIL.waitAll( this.items.map( function ( item ) {
            return item.getLegends( layerCatalog, viewer )
        } ) )
        .then ( function ( legends ) {
            return legends.reduce( function ( accum, v ) { return accum.concat( v ) }, [] )
        } )
    }
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    function createLayerDisplay( option, layerCatalog, forceVisible ) {
        if ( !option.type )
            option.type = 'layer'

        if ( option.type in LayerDisplay )
            return new LayerDisplay[ option.type ]( option, layerCatalog, forceVisible )
        else
            throw new Error( 'invalid layer display type' )
    } 
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    var LayerDisplayContextEvent = SMK.TYPE.Event.define( [
        'changedVisibility'
    ] )

    function LayerDisplayContext( items, layerCatalog ) {
        var self = this

        LayerDisplayContextEvent.prototype.constructor.call( this )

        this.root = createLayerDisplay( { 
            id:         'root',
            type:       'folder',
            isExpanded: true, 
            isVisible:  true,
            items:      items
        }, layerCatalog )

        this.itemId = {}
        this.layerIds = []

        var nextId = ( function () {
            var c = 1000
            return function () {
                c += 1
                return c
            }
        } )()

        this.root.each( function ( item, parents ) {
            if ( item.id in self.itemId ) {
                if ( item.type == 'layer' ) {
                    console.warn( 'Layer "' + item.id + '" is duplicated in layer display' )
                    item.isEnabled = false
                }
                else {
                    console.warn( item.type + ' "' + item.id + '" is duplicated in layer display' )
                    var id = item.id
                    do {
                        item.id = SMK.UTIL.makeId( id, nextId() )
                    } while ( item.id in self.itemId )
                }
            }

            self.itemId[ item.id ] = [ item ].concat( parents )

            if ( item.type == 'layer' && item.isEnabled ) {
                item.index = self.layerIds.length
                self.layerIds.push( item.id )
            }
        } )

        this.changedVisibility( function () {
            self.root.each( function ( item ) {
                item.isActuallyVisible = self.isItemVisible( item.id )
            } )
        } )

        this.changedVisibility()
    }

    SMK.TYPE.LayerDisplayContext = LayerDisplayContext

    $.extend( LayerDisplayContext.prototype, LayerDisplayContextEvent.prototype )
    // _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    //
    LayerDisplayContext.prototype.getLayerIds = function () {
        return this.layerIds
    }

    LayerDisplayContext.prototype.getLayerIndex = function ( id ) {
        if ( !( id in this.itemId ) ) return 

        if ( this.itemId[ id ][ 0 ].type == 'layer' )
            return this.itemId[ id ][ 0 ].index
    }

    LayerDisplayContext.prototype.setFolderExpanded = function ( id, expanded ) {
        if ( !( id in this.itemId ) ) return 

        if ( this.itemId[ id ][ 0 ].type == 'folder' )
            this.itemId[ id ][ 0 ].isExpanded = expanded
    }

    LayerDisplayContext.prototype.isItemVisible = function ( id ) {
        if ( !( id in this.itemId ) ) return false

        return this.itemId[ id ].reduce( function ( accum, ld ) {
            return accum && ld.isVisible
        }, true )
    }

    LayerDisplayContext.prototype.setItemVisible = function ( id, visible, deep ) {
        if ( !( id in this.itemId ) ) return 

        var lds = this.itemId[ id ]

        if ( visible )
            lds.forEach( function ( ld ) {
                ld.isVisible = true
            } )
        else
            lds[ 0 ].isVisible = false

        if ( deep ) {
            lds[ 0 ].each( function ( item ) {
                item.isVisible = visible
                if ( item.type == 'group' ) return false 
            } )
        }

        this.changedVisibility()        

        return visible
    }

    LayerDisplayContext.prototype.setLegendsVisible = function ( visible, layerCatalog, viewer ) {
        this.root.each( function ( item ) {
            if ( visible ) {
                if ( item.legends === false ) return
                if ( item.showLegend == 'waiting' ) return
                if ( item.legends ) {
                    item.showLegend = true
                    return
                }

                item.showLegend = 'waiting'
                item.getLegends( layerCatalog, viewer )
                    .then( function ( ls ) {
                        item.legends = ls
                        if ( item.showLegend == 'waiting' )
                            item.showLegend = true
                    }, function () {
                        item.legends = false
                        item.showLegend = false
                    } )
            }
            else {
                item.showLegend = false
            }

            if ( item.type == 'group' ) return false 
        } )
    }

    LayerDisplayContext.prototype.setFilter = function ( regex ) {
        var self = this

        this.root.each( function ( item ) {
            item.inFilter = false
            if ( regex.test( item.title ) )
                self.itemId[ item.id ].forEach( function ( i ) {
                    i.inFilter = true 
                } )

            if ( item.type == 'group' ) return false 
        } )
    }
} )