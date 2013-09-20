module.exports = function (grunt) {

    var appConfig = {
        components: 'components',
        javascripts: 'app',

        stylesheets: 'stylesheets',
        images: 'assets/images',
        fonts: 'assets/fonts',
        app: {
            typescripts: 'src/main/typescripts',
            libs: 'src/main/libs',
            views: 'src/main/views',
            tsd: 'src/main/typescripts/libs/DefinitelyTyped'
        },
        test: {
            typescripts: 'src/test/typescripts',
            libs: 'src/test/libs',
            tsd: 'src/test/typescripts/libs/DefinitelyTyped',
            stylesheets: 'src/test/stylesheets'
        },
        dist: {
            scripts: '../public/scripts',
            libs: '../public/scripts/libs',
            stylesheets: '../public/stylesheets',
            views: '../public/views',
            images: '../public/images',
            fonts: '../public/fonts'
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
                    declaration_file: false
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: 'bower-task',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: true,
                    cleanBowerDir: false
                }
            }
        },
        copy: {
            view: {
                files: [
                    {expand: true, flatten: true, cwd: '', src: ['<%= conf.app.views %>/*.html'], dest: '<%= conf.dist.views %>'},
                ]
            },
            bower: {
                files: [
                    {expand: true, flatten: true, cwd: 'bower-task/', src: ['main-js/**/*.js'], dest: '<%= conf.dist.libs %>'},
                    {expand: true, flatten: true, cwd: 'bower-task/', src: ['main-css/**/*.css'], dest: '<%= conf.dist.stylesheets %>'},

                    {expand: true, flatten: true, cwd: 'bower-task/', src: ['test-js/**/*.js'], dest: '<%= conf.test.libs %>'},
                    {expand: true, flatten: true, cwd: 'bower-task/', src: ['test-css/**/*.css'], dest: '<%= conf.test.stylesheets %>'}
                ]
            },
            tsd: {
                files: [
                    {
                        expand: true,
                        cwd: 'd.ts/DefinitelyTyped/',
                        src: [
                            'angularjs/angular.d.ts',
                            'angularjs/angular-resource.d.ts',
                            'jquery/*.d.ts',
                            'marked/*.d.ts'
                        ],
                        dest: '<%= conf.app.tsd %>'
                    },
                    {
                        expand: true,
                        cwd: 'd.ts/DefinitelyTyped/',
                        src: [
                            'angularjs/angular-mocks.d.ts',
                            'jasmine/*.d.ts'
                        ],
                        dest: '<%= conf.test.tsd %>'
                    }
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
                        '<%= conf.dist.libs %>/jquery.js',
                        '<%= conf.dist.libs %>/angular.js',
                        '<%= conf.dist.libs %>/angular-resource.js',
                        '<%= conf.dist.libs %>/keypress.js',
                        '<%= conf.dist.libs %>/bootstrap.js',
                        '<%= conf.dist.libs %>/highlight.pack.js',
                        '<%= conf.dist.libs %>/marked.js',
                        '<%= conf.dist.scripts %>/controllers/*.js',
                        '<%= conf.dist.scripts %>/models/*.js',
                        '<%= conf.dist.scripts %>/*.js'
                    ]
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
        ['bower', 'exec:tsd']);

    grunt.registerTask(
        'default',
        "compile",
        ['typescript:main']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};