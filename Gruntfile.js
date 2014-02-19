module.exports = function(grunt) {
	grunt.initConfig({
        jslint: {
            library: {
                src: [
                    'lib/**/*.js',
                    'test/**/*.js'
                ],
                directives: {
                    node: true,
                    unparam: true,
                    nomen: true,
                    stupid: true
                },
                options: {
                    errorsOnly: true,
                    failOnError: false
                }
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
                    ui: 'bdd',
                    require: [ 'should' ]
                },
                src: ['coverage/test/**/*.js']
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
        },
        watch : {
            files: [ 
                'lib/**/*.js',
                'test/**/*.js'
            ],
            tasks: [ 'default' ]
        }
	});

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-blanket');

    grunt.registerTask('build', ['clean', 'blanket', 'copy']);
    grunt.registerTask('test', ['build', 'mochaTest']);
	grunt.registerTask('default', ['jslint', 'test']);
};