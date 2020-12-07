module.exports = function( grunt ) {

    grunt.registerTask( 'build-info', [ 
        'gitinfo',
        'fix-commit-time'
    ] )

    grunt.registerTask( 'fix-commit-time', function () {
        var t = grunt.config( 'gitinfo.local.branch.current.lastCommitTime' )
        t = t.replace( /^"|"$/g, '' )
        grunt.config( 'gitinfo.local.branch.current.lastCommitTime', t )
    } )

    grunt.config.merge( {
        gitinfo: {},
    } )

    grunt.log.ok( 'Task build-info' )
}