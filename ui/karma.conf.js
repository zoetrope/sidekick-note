// Karma configuration
// Generated on Sat Sep 21 2013 01:59:32 GMT+0900 (JST)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            '../public/scripts/libs/jquery.js',
            '../public/scripts/libs/angular.js',
            '../public/scripts/libs/angular-*.js',
            '../public/scripts/libs/keypress.js',
            '../public/scripts/libs/bootstrap.js',
            '../public/scripts/libs/highlight.pack.js',
            '../public/scripts/libs/marked.js',
            '../public/scripts/models/*.js',
            '../public/scripts/controllers/*.js',
            '../public/scripts/App.js',
            'src/test/libs/**/*.js',
            'src/test/scripts/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: [
            '../public/scripts/main.min.js',
            'src/test/libs/jasmine*.js'
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
