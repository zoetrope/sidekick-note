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
            stylesheets: 'src/main/stylesheets',
            libs: 'src/main/libs',
            views: 'src/main/typescripts',
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
                src: ['<%= conf.app.typescripts %>/**/*.ts'],
                dest: '<%= conf.dist.scripts %>/App.js',
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
                tasks: ['clean:mainjs', 'typescript:main']
            },
            "typescript-test": {
                files: [ '<%= conf.test.typescripts %>/**/*.ts'],
                tasks: ['typescript']
            },
            views: {
                files: ['<%= conf.app.views %>/**/*.tpl.html', '<%= conf.app.stylesheets %>/**/*.css'],
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
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.views %>/**/*.tpl.html'], dest: '<%= conf.dist.views %>'},
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.images %>/*.*'], dest: '<%= conf.dist.images %>'},
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.stylesheets %>/*.css'], dest: '<%= conf.dist.stylesheets %>'}
                ]
            }
        },
        shell: {
            mkdir_glyphicons: {
                command: 'mkdir <%= conf.dist.glyphicons %>',
                options: {
                    stdout: true
                }
            },
            move_bootstrap_fonts: {
                command: 'mv <%= conf.dist.fonts %>/bootstrap/* <%= conf.dist.glyphicons %>',
                options: {
                    stdout: true
                }
            },
            mkdir_jqueryui_images: {
                command: 'mkdir <%= conf.dist.stylesheets %>/jquery-ui/images',
                options: {
                    stdout: true
                }
            },
            move_jqueryui_images: {
                command: 'mv <%= conf.dist.images %>/jquery-ui/* <%= conf.dist.stylesheets %>/jquery-ui/images',
                options: {
                    stdout: true
                }
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
                    '<%= conf.dist.scripts %>/alllib.js': [
                        /* 依存関係の順に並べること */
                        '<%= conf.dist.libs %>/jquery/*.js',
                        '<%= conf.dist.libs %>/jquery-ui/*.js',
                        '<%= conf.dist.libs %>/angular/*.js',
                        '<%= conf.dist.libs %>/angular-resource/*.js',
                        '<%= conf.dist.libs %>/angular-route/*.js',
                        '<%= conf.dist.libs %>/angular-ui-utils/*.js',
                        '<%= conf.dist.libs %>/angular-ui-select2/*.js',
                        '<%= conf.dist.libs %>/angular-ui-date/*.js',
                        '<%= conf.dist.libs %>/angular-ui-bootstrap/*.js',
                        '<%= conf.dist.libs %>/select2/*.js',
                        '<%= conf.dist.libs %>/bootstrap/*.js',
                        '<%= conf.dist.libs %>/highlightjs/*.js',
                        '<%= conf.dist.libs %>/marked/*.js',
                        '<%= conf.dist.libs %>/rxjs/rx.js',
                        '<%= conf.dist.libs %>/rxjs/rx.async.js'
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
            },
            mainjs: {
                src: [
                    '<%= conf.dist.scripts %>/main.min.js'
                ],
                options: {
                    force: true
                }
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
                    return "tsd install jquery angular angular-resource angular-route marked jasmine angular-mocks rx.js";
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
        ['clean:dist', 'bower', 'copy', 'shell', 'typescript:main', 'uglify:dev']);

    grunt.registerTask(
        'run',
        "compile and watch",
        ['clean:dist', 'bower', 'copy', 'shell', 'typescript:main', 'uglify:dev', 'watch']);

    grunt.registerTask(
        'test',
        "test by karma",
        ['clean:dist', 'clean:test', 'bower', 'typescript', 'karma']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};