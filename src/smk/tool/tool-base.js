include.module( 'tool.tool-base-js', [ 'tool.tool-js' ], function ( inc ) {
    "use strict";

    SMK.TYPE.ToolBase = function () {
        this.defineProp( 'id' )
        this.defineProp( 'type' )
        this.defineProp( 'title' )
        this.defineProp( 'status' )
        this.defineProp( 'visible', { onSet: function () { this.changedVisible() } } )
        this.defineProp( 'enabled', { onSet: function () { this.changedEnabled() } } )
        this.defineProp( 'active', { onSet: function () { this.changedActive() } } )
        this.defineProp( 'group', { onSet: function () { this.changedGroup() } } )
        this.defineProp( 'parentId' )
        this.defineProp( 'showTitle' )
        this.defineProp( 'icon' )
        this.defineProp( 'order' )
        this.defineProp( 'busy' )

        this.visible = false
        this.enabled = false
        this.active = false
        this.group = false
        this.busy = false

        this.$propFilter.baseClasses = false

        this.$initializers.push( function ( smk ) {
            var self = this

            function setParentId ( tool, parentId ) {
                tool.parentId = parentId
                tool.hasPrevious = !!parentId

                if ( !tool.parentId ) {
                    tool.rootId = tool.id
                }

                var group = {}
                smk.forEachTool( function ( t ) {
                    var r = t.rootId = findRoot( t.id )

                    if ( !group[ r ] ) group[ r ] = []
                    group[ r ].push( t.id )
                } )

                smk.$group = group

                function findRoot( toolId ) {
                    var tool = smk.getToolById( toolId )
                    while ( true ) {
                        var parent = smk.getToolById( tool.parentId )
                        if ( !parent ) return tool.id
                        tool = parent
                    }
                }
            }

            setParentId( this, this.parentId )

            var positions = [].concat( this.position || [] )

            if ( positions.length ) {
                positions.push( 'toolbar' )

                var found = positions.some( function ( p ) {
                    if ( p == self.id || p == self.type )
                        return false

                    if ( !smk.hasToolType( p ) && !smk.getToolById( p ) ) {
                        console.warn( 'position ' + p + ' not available for tool ' + self.id )
                        return false
                    }

                    if ( smk.hasToolType( p ) ) {
                        var tools = smk.getToolsByType( p )
                        if ( tools.length > 1 ) {
                            console.warn( 'position ' + p + ' is ambiguous for tool ' + self.id )
                            return false
                        }
                        return tools[ 0 ].addTool( self, smk, setParentId )
                    }
                    else {
                        return smk.getToolById( p ).addTool( self, smk, setParentId )
                    }
                } )

                if ( !found ) {
                    console.warn( 'no position found for tool ' + self.id )
                }
            }

            this.changedActive( function () {
                var ids = smk.getToolGroup( self.rootId )
                var g = ids.some( function ( id ) {
                    return smk.getToolById( id ).active
                } )
                ids.forEach( function ( id ) {
                    smk.getToolById( id ).group = g
                } )

                if ( self.active ) {
                    ids.forEach( function ( id ) {
                        smk.getToolById( id ).active = self.isToolInGroupActive( id )
                    } )
                }
                else {
                }
            } )

            if ( this.id == this.rootId )
                this.changedGroup( function () {
                    if ( self.group ) {
                        smk.getToolRootIds().forEach( function ( rootId ) {
                            if ( rootId == self.id ) return

                            smk.getToolGroup( rootId ).forEach( function ( id ) {
                                smk.getToolById( id ).active = false
                            } )
                        } )
                    }
                    else {
                    }
                } )

            this.showStatusMessage = function ( message, status, delay ) {
                return smk.getStatusMessage().show( message, status, delay, this.busy )
            }

            this.setDefaultDrawStyle = function() {
                smk.$viewer.map.pm.setGlobalOptions({ 
                    templineStyle: { 
                        color: 'red',
                        fill: false
                    }, 
                    hintlineStyle: { 
                        color: 'red',
                        fill: false,
                        dashArray: [5, 5] 
                    },
                    pathOptions: {
                        color: '#3388ff'
                    } 
                });
            }
        } )

        this.isToolInGroupActive = function ( toolId ) {
            return toolId == this.id
        }

        this.addTool = function ( tool, smk ) {
            return false
        }

    }
} )
