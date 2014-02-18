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
        mochaTest: {
            library: {
                options: {
                    reporter: 'spec',
                    ui: 'bdd',
                    require: [ 'should' ]
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    require: [ 'coverage/blanket', 'should' ],
                    quiet: true,
                    captureFile: 'coverage.html'
                },
                src: [ 'test/**/*.js' ]
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
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-cov');

	grunt.registerTask('default', ['jslint', 'mochaTest']);
};