module.exports = function( grunt ) {

    grunt.registerTask( 'build-info', function () {
        var pkg = grunt.config( 'package' )
        if ( pkg.build ) {
            if ( !grunt.config( 'gitinfo.local' ) )
                grunt.config( 'gitinfo', pkg.build.gitinfo )

            grunt.log.ok( 'Build info taken from package.json' )
        }
        else {
            if ( grunt.config( 'pom' ) )
                grunt.task.run( [ 'gitinfo' ] )
            else
                grunt.task.run( [ 'gitinfo', 'mavenEffectivePom:main', 'update-version' ] )
        }
    } )

    grunt.registerTask( 'update-version', function () {
        grunt.config( 'package.version', grunt.config( 'pom.project.version' ) )
        grunt.log.ok( 'Updated version to ' + grunt.config( 'package.version' ) )
    } )

    grunt.config.merge( {
        gitinfo: {},

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