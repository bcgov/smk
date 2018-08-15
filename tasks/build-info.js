module.exports = function( grunt ) {

    grunt.registerTask( 'build-info', function () {
        if ( grunt.config( 'pom' ) )
            grunt.task.run( [ 'gitinfo' ] )
        else
            grunt.task.run( [ 'gitinfo', 'mavenEffectivePom:main' ] )
    } )

    grunt.config.merge( {
        gitinfo: {},
    } )

    grunt.config.merge( {

        mavenEffectivePom: {
            main: {
                options: {
                    file: '../target/effective-pom.xml',
                    varName: 'pom'
                }
            }
        }
    } )

    grunt.log.ok( 'Task build-info' )
}