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
        clean: {
            coverage: {
                src: ['coverage/']
            }
        },
        copy: {
            coverage: {
                src: ['test/**'],
                dest: 'coverage/'
            }
        },
        blanket: {
            coverage: {
                src: ['lib/'],
                dest: 'coverage/lib/'
            }
        },
        mochaTest: {
            library: {
                options: {
                    reporter: 'spec',
                    require: [ 'should' ]
                },
                src: ['coverage/test/**/*.js']
            },
            watch: {
                options: {
                    reporter: 'dot',
                    require: [ 'should' ]
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    require: [ 'should' ],
                    quiet: true,
                    captureFile: 'coverage.html'
                },
                src: ['coverage/test/**/*.js']
            },
            'travis-cov': {
                options: {
                    reporter: 'travis-cov'
                },
                src: ['coverage/test/**/*.js']
            },
            'mocha-lcov-reporter': {
                options: {
                    reporter: 'mocha-lcov-reporter',
                    quiet: true,
                    captureFile: 'lcov.info'
                },
                src: ['coverage/test/**/*.js']
            }
        },
        coveralls: {
            options: {
                force: true
            },
            all: {
                src: 'lcov.info'
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('build', ['clean', 'blanket', 'copy']);
    grunt.registerTask('test', ['build', 'mochaTest:library', 'mochaTest:coverage', 'mochaTest:travis-cov', 'mochaTest:mocha-lcov-reporter']);
	  grunt.registerTask('default', ['eslint', 'test']);
    grunt.registerTask('code', ['eslint', 'mochaTest:watch']);
    grunt.registerTask('ci', ['default', 'coveralls']);
};
