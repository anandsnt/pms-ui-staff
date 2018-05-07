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
            '../rover/rvSntApp.js',
            '../rover/rvDesktopCardOperations.js',
            '../rover/rvMLIOperations.js',
            '../shared/baseCtrl.js',
            '../shared/lib/js/angular.min.js',
            '../shared/lib/js/angular-ui-router.min.js',
            '../shared/lib/js/angular-mocks.js',
            '../shared/directives/documentTouchMovePrevent/*.js',
            '../shared/directives/clickTouch/*.js',
            '../shared/lib/js/angular-sanitize.min.js',
            '../shared/lib/js/iscroll.js',
            '../shared/lib/js/ng-iscroll.js',
            '../shared/lib/js/ngDialog.min.js',
            '../shared/lib/js/SyntaxHighlighter/shCore.js',
            '../shared/lib/js/Utils.js',
            './loginApp.js',
            './services/**/*.js',
            './controllers/**/*.js'
        ],


        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './**/!(*spec).js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: '../../../reports/login/coverage/',
            type: 'lcov',
            subdir: '.'
        },


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
