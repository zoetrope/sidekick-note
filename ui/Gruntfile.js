module.exports = function (grunt) {

    var appConfig = {
        stylesheets: 'stylesheets',
        images: 'assets/images',
        fonts: 'assets/fonts',
        tsd: 'src/d.ts',
        app: {
            typescripts: 'scripts',
            stylesheets: 'stylesheets',
            views: 'scripts',
            images: 'images'
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
            }
        },
        watch: {
            "typescript-main": {
                files: ['<%= conf.app.typescripts %>/**/*.ts'],
                tasks: ['clean:mainjs', 'typescript:main']
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
            },
            mkdir_rxprop_ts: {
                command: 'mkdir <%= conf.tsd %>/ReactivePropertyAngular',
                options: {
                    stdout: true
                }
            },
            move_rxprop_ts: {
                command: 'mv bower_components/reactiveproperty-angular/typescript/* <%= conf.tsd %>/ReactivePropertyAngular',
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
                        '<%= conf.dist.libs %>/angular-ui-bootstrap-bower/*.js',
                        '<%= conf.dist.libs %>/select2/*.js',
                        '<%= conf.dist.libs %>/bootstrap/*.js',
                        '<%= conf.dist.libs %>/highlightjs/*.js',
                        '<%= conf.dist.libs %>/marked/*.js',
                        '<%= conf.dist.libs %>/momentjs/moment.js',
                        '<%= conf.dist.libs %>/momentjs/ja.js',
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
        exec: {
            tsd: {
                cmd: function () {
                    return "tsd install jquery angular angular-resource angular-route marked jasmine angular-mocks rx.js moment";
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

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};