module.exports = function( grunt ) {

    grunt.registerTask( 'build-tags', [
        'exec:smk-tags',
        'filter-tags:smk'
    ] )

    grunt.config.merge( {

        exec: {
            'smk-tags': {
                src: '<%= srcPath %>/smk-tags.js',
                dest: '<%= tempPath %>/smk-tags.json',
            }
        },

        'filter-tags': {
            smk: {
                options: {
                    result: 'tagRef'
                },
                src: '<%= tempPath %>/smk-tags.json'
            }
        },

    } )

    grunt.log.ok( 'Task build-tags' )
}