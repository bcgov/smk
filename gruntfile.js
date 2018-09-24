module.exports = function( grunt ) {
    grunt.initConfig( {
        package: grunt.file.readJSON( 'package.json' ),

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
        },

        zip: {
            dev: {
                expand: true,
                dest: 'smk-<%= package.version %>-src.zip',
                src: [ './src/**' ]
            }
        }
    } )

    grunt.loadNpmTasks( 'grunt-contrib-connect' )
    grunt.loadNpmTasks( 'grunt-zip' )

    grunt.registerTask( 'default', [ 'connect' ] )

    grunt.registerTask( 'maven', [ 'zip' ] )
}