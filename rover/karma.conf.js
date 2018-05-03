// Karma configuration
// Generated on Tue Feb 13 2018 18:35:56 GMT+0530 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        '../shared/lib/js/jquery.min.js',
        '../shared/lib/js/jquery-ui.min.js',
        '../shared/lib/js/jquery.ui.touch-punch.min.js',
        '../shared/lib/js/angular.min.js',
        '../shared/lib/js/angular-route.min.js',
        '../shared/lib/js/angular-ui-router.1.0.15.min.js',
        '../shared/lib/js/angular-animate.min.js',
        '../shared/lib/js/angular-dragdrop.min.js',
        '../shared/lib/js/angular-mocks.js',
        '../shared/lib/js/angular-sanitize.min.js',
        '../shared/lib/js/angular-translate.min.js',
        '../shared/lib/js/angular-translate-loader-static-files.min.js',
        '../shared/lib/js/oclazyload/ocLazyLoad.min.js',
        '../shared/lib/js/ui-utils.min.js',
        '../shared/lib/js/underscore.min.js',
        '../shared/lib/js/iscroll.js',
        '../shared/lib/js/ng-iscroll.js',
        '../shared/lib/js/ngDialog.min.js',
        '../shared/lib/js/fastclick/fastclick.min.js',
        '../shared/lib/js/moment.min.js',
        '../shared/lib/js/date.js',
        '../node_modules/karma-read-json/karma-read-json.js',
        '../shared/baseCtrl.js',
        '../shared/directives/documentTouchMovePrevent/*.js',
        '../shared/directives/clickTouch/*.js',
        '../shared/directives/divTouchMoveStopPropogate/*.js',
        '../shared/interceptors/**/*.js',
        '../shared/directives/**/*.js',
        '../shared/sntTransitionManager/**/*.js',
        '../shared/lib/js/Utils.js',
        './rvApp.js',
        './rvSntApp.js',
        './rvCacheVaultModule.js',
        './rvCardOperations.js',
        './rvDesktopCardOperations.js',
        './rvMLIOperations.js',
        './rvRouter.js',
        './rvSwipeOperations.js',
        './rvRouters/*.js',
        './controllers/**/*.js',
        './services/**/*.js',
        './constants/**/*.js',
        // './directives/**/*.js',
        './factories/**/*.js',
        './filters/*.js',
        '../shared/baseCtrl.js',
        './partials/**/*.html',
        {pattern: 'unitTestSampleData/**/*.json', included: false}        
    ],

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '../payment/**/*.js': ['babel'],
        './controllers/**/*.js': ['babel'],
        './services/rateManager_/rvRateManagerCoreSrv.js': ['babel'],
         './partials/**/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
        stripPrefix: './',
        prependPrefix: '/assets/'
    },


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
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
