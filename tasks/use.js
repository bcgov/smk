
module.exports = function( grunt ) {

    var connect = {
        http: {
            options: {
                protocol: 'http',
                hostname: '*',
                port: 8888,
                base: '.',
                livereload: true,
                // debug: true
            }
        },
        https: {
            options: {
                protocol: 'https',
                hostname: '*',
                port: 8443,
                base: '.',
                // livereload: true,
                keepalive:  true,
                // debug: true
            }
        }
    }

    grunt.registerTask( 'use', 'connection to use', function ( protocol, host ) {
        if ( !( protocol in connect ) ) {
            grunt.fail.fatal( 'Protocol ' + protocol + ' not defined' )
            return
        }

        var connectConfig = { connect: {} }
        connectConfig.connect[ protocol ] = connect[ protocol ]

        grunt.config.merge( connectConfig )

        if ( host )
            grunt.config( 'serverHost', host )

        grunt.log.ok( 'Connect using ' + protocol + '://' + grunt.config( 'serverHost' ) )
    } )

    grunt.log.ok( 'Task use' )
}