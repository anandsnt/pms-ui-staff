// Karma configuration
// Generated on Tue Feb 13 2018 18:35:56 GMT+0530 (IST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            '../shared/lib-legacy/js/jquery.min.js',
            '../shared/lib-legacy/js/underscore.min.js',
            '../shared/lib-legacy/js/angular.min.js',
            '../shared/lib-legacy/js/angular-ui-router.min.js',
            '../shared/lib-legacy/js/bootstrap.min.js',
            '../shared/lib-legacy/js/ui-bootstrap-tpls-0.10.0.js',
            '../shared/lib-legacy/js/angular-sanitize.min.js',
            '../shared/lib/js/angular-mocks.js',
            './utility/gw_util.js',
            './utility/gw_theming_utility.js',
            './gw_app.js',
            './gw_app_config.js',
            './routers/**/*.js',
            './scripts/angular-pickdate.js',
            './services/**/*.js',
            './controllers/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
