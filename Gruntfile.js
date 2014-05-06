module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-war');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'build/exploded/browser-bundle.js': [ 'index.js' ]
                }
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/exploded/browser-bundle.js',
                dest: 'build/exploded/browser-bundle.min.js'
            }
        },
        war: {
            target: {
                options: {
                    war_dist_folder: 'build/',
                    war_verbose: true,
                    war_name: 'eformat-neu',
                    webxml_welcome: 'index.html',
                    webxml_display_name: 'eformat'
                },
                files: [
                    { expand: true,
                      cwd: 'build/exploded/',
                      src: ['*'],
                      dest: ''
                    },
                    { expand: true,
                      cwd: '.',
                      src: ['index.html'],
                      dest: ''
                    }
                ]
            }
        }
    });
    grunt.registerTask('default', ['browserify', 'uglify', 'war']);


};