module.exports = function( grunt ) {
    grunt.initConfig( {
        connect: {
            https: {
                options: {
                    protocol:   'https',
                    hostname:   '*',
                    port:       8443,
                    base:       '.',
                    keepalive:  true,
                    debug:      true,
                    open:       true
                }
            }
        }
    } )

    grunt.loadNpmTasks( 'grunt-contrib-connect' )

    grunt.registerTask( 'default', [ 'connect' ] )
}