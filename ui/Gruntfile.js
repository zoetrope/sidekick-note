module.exports = function (grunt) {
    grunt.initConfig({
        typescript: {
            main: {
                src: ['src/main/typescript/App.ts'],
                dest: '../public/scripts/',
                options: {
                    target: 'es5',
                    base_path: 'src/main/typescript',
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