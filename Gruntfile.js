module.exports = function(grunt) {
	grunt.initConfig({
        eslint: {
            target: [
              'lib/**/*.js',
              'test/**/*.js'
            ],
						options: {
							configFile: 'eslint.json'
						}
        },
        mochaTest: {
            library: {
                options: {
                    reporter: 'spec',
                    require: [ 'should' ]
                },
                src: ['test/**/*.js']
            },
            watch: {
                options: {
                    reporter: 'dot',
                    require: [ 'should' ]
                },
                src: ['test/**/*.js']
            }
        },
        watch : {
            files: [
                'lib/**/*.js',
                'test/**/*.js'
            ],
            tasks: [ 'code' ]
        }
	});

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', [ 'mochaTest:library' ]);
	  grunt.registerTask('default', ['eslint', 'test']);
    grunt.registerTask('code', ['eslint', 'mochaTest:watch']);
    grunt.registerTask('ci', ['default' ]);
};
