module.exports = function(grunt) {
	grunt.initConfig({
        jslint: {
            library: {
                src: [
                    'lib/**/*.js'
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
        watch : {
            files: [ 
                'lib/**/*.js'
            ],
            tasks: [ 'jslint:library' ]
        }
	});

	grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jslint']);
};