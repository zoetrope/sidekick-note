module.exports = function (grunt) {

    var appConfig = {
        components: 'components',
        javascripts: 'app',

        stylesheets: 'stylesheets',
        images: 'assets/images',
        fonts: 'assets/fonts',
        tsd: 'src/d.ts',
        app: {
            typescripts: 'src/main/typescripts',
            libs: 'src/main/libs',
            views: 'src/main/views',
            images: 'src/main/images'
        },
        test: {
            typescripts: 'src/test/typescripts',
            scripts: 'src/test/scripts',
            libs: 'src/test/libs',
            stylesheets: 'src/test/stylesheets'
        },
        dist: {
            scripts: '../public/scripts',
            libs: '../public/scripts/libs',
            stylesheets: '../public/stylesheets',
            views: '../public/views',
            images: '../public/images',
            fonts: '../public/fonts',
            glyphicons: '../public/stylesheets/fonts'
        }
    };

    grunt.initConfig({
        conf: appConfig,
        typescript: {
            main: {
                src: ['<%= conf.app.typescripts %>/App.ts'],
                dest: '<%= conf.dist.scripts %>',
                options: {
                    target: 'es5',
                    base_path: '<%= conf.app.typescripts %>',
                    sourcemap: false,
                    declaration: false
                }
            },
            test: {
                src: ['<%= conf.test.typescripts %>/AppSpec.ts'],
                dest: '<%= conf.test.scripts %>/AppSpec.js',
                options: {
                    target: 'es5',
                    sourcemap: false,
                    declaration: false
                }
            }
        },
        watch: {
            "typescript-main": {
                files: ['<%= conf.app.typescripts %>/**/*.ts'],
                tasks: ['typescript:main', 'uglify:dev']
            },
            "typescript-test": {
                files: [ '<%= conf.test.typescripts %>/**/*.ts'],
                tasks: ['typescript']
            },
            views: {
                files: ['<%= conf.app.views %>/**/*.html'],
                tasks: ['copy:static']
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: '../',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        copy: {
            static: {
                files: [
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.views %>/*.html'], dest: '<%= conf.dist.views %>'},
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.images %>/*.*'], dest: '<%= conf.dist.images %>'}
                ]
            },
            fonts: {
                files: [
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.dist.fonts %>/bootstrap/*.*'], dest: '<%= conf.dist.glyphicons %>'}
                ]
            }
        },
        uglify: {
            dev: {
                options: {
                    report: 'min',
                    beautify:true,
                    mangle: false,
                    preserveComments: 'some',

                    sourceMap: '<%= conf.dist.scripts %>/source.js.map',
                    sourceMapRoot: '',
                    sourceMappingURL: 'source.js.map'
                },
                files: {
                    '<%= conf.dist.scripts %>/main.min.js': [
                        /* 依存関係の順に並べること */
                        '<%= conf.dist.libs %>/jquery/*.js',
                        '<%= conf.dist.libs %>/angular/*.js',
                        '<%= conf.dist.libs %>/angular-resource/*.js',
                        '<%= conf.dist.libs %>/angular-ui-utils/*.js',
                        '<%= conf.dist.libs %>/angular-ui-select2/*.js',
                        '<%= conf.dist.libs %>/angular-ui-bootstrap/*.js',
                        '<%= conf.dist.libs %>/select2/*.js',
                        '<%= conf.dist.libs %>/bootstrap/*.js',
                        '<%= conf.dist.libs %>/highlightjs/*.js',
                        '<%= conf.dist.libs %>/marked/*.js',
                        '<%= conf.dist.scripts %>/models/*.js',
                        '<%= conf.dist.scripts %>/services/*.js',
                        '<%= conf.dist.scripts %>/controllers/*.js',
                        '<%= conf.dist.scripts %>/App.js'
                    ]
                }
            }
        },
        clean: {
            dist: {
                src: [
                    '../public/*'
                ],
                options: {
                    force: true
                }
            },
            test: {
                src: [
                    '<%= conf.test.scripts %>/*',
                    '<%= conf.test.libs %>/*',
                    '<%= conf.test.stylesheets %>/*'
                ]
            },
            tsd: {
                src: [
                    '<%= conf.tsd %>'
                ]
            },
            bower: {
                src: [
                    'bower_components'
                ]
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'karma.conf.js',
                    autoWatch: false,
                    browsers: ['Chrome'],
                    reporters: ['progress', 'junit'],
                    singleRun: true,
                    keepalive: true
                }
            }
        },
        exec: {
            tsd: {
                cmd: function () {
                    return "tsd install jquery angular angular-resource marked jasmine angular-mocks";
                }
            }
        }
    });

    grunt.registerTask(
        'setup',
        "Setup project",
        ['clean', 'bower', 'exec:tsd']);

    grunt.registerTask(
        'default',
        "compile",
        ['clean:dist', 'bower', 'copy', 'typescript:main', 'uglify:dev']);

    grunt.registerTask(
        'run',
        "compile and watch",
        ['clean:dist', 'bower', 'copy', 'typescript:main', 'uglify:dev', 'watch']);

    grunt.registerTask(
        'test',
        "test by karma",
        ['clean:dist', 'clean:test', 'bower', 'typescript', 'karma']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};