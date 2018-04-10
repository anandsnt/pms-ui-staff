// Karma configuration
// Generated on Tue Feb 13 2018 18:35:56 GMT+0530 (IST)
module.exports = function(config) {
    var sharedRoot = '../shared/',
    jsLibRoot = sharedRoot + 'lib-legacy/js/',
    zestRoot = './',
    paymentRoot = '../payment/';
    
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            jsLibRoot + 'jquery.min.js',
            jsLibRoot + 'jquery-ui.min.js',
            jsLibRoot + 'jquery.ui.touch-punch.min.js',
            jsLibRoot + 'angular.min.js',
            jsLibRoot + 'angular-route.min.js',
            jsLibRoot + 'angular-ui-router.min.js',
            jsLibRoot + 'angular-animate.min.js',
            jsLibRoot + 'angular-sanitize.min.js',
            jsLibRoot + 'angular-translate.min.js',
            jsLibRoot + 'angular-translate-loader-static-files.min.js',
            sharedRoot + 'lib/js/angular-mocks.js',
            jsLibRoot + 'ui-utils.min.js',
            jsLibRoot + 'underscore.min.js',
            jsLibRoot + 'ngDialog.min.js',
            jsLibRoot + 'fastclick.min.js',
            jsLibRoot + 'signature/**/*.js',
            jsLibRoot + 'fullcalender/**/*.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-mobile.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-navigation.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-previewkeyset.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-scramble.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-typing.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.min.js',
            jsLibRoot + 'stationKeyboard/jquery.mousewheel.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-autocomplete.min.js',
            jsLibRoot + 'oclazyload/ocLazyLoad.min.js',
            jsLibRoot + 'iscroll.js',
            jsLibRoot + 'ng-iscroll.js',
            jsLibRoot + 'Utils.js',
            jsLibRoot + 'jquery.select-to-autocomplete.js',
            sharedRoot + 'interceptors/**/*.js',
            sharedRoot + 'directives/documentTouchMovePrevent/*.js',
            sharedRoot + 'directives/divTouchMoveStopPropogate/*.js',
            sharedRoot + 'directives/orientationInputBlur/*.js',
            sharedRoot + 'directives/iScrollFixes/iscrollStopPropagation.js',
            sharedRoot + 'directives/touchPress/touchPress.js',
            sharedRoot + 'directives/enterPress/enterPress.js',
            sharedRoot + 'directives/clickTouch/clickTouch.js',
            sharedRoot + 'directives/activityIndicator/sntActivityIndicator.js',
            jsLibRoot + 'date.js',
            sharedRoot + 'cordova.js',
            zestRoot + 'zsApp.js',
            zestRoot + 'zsUtils.js',
            zestRoot + 'zsWebSocketActions.js',
            zestRoot + 'zsChromeAppActions.js',
            zestRoot + 'zsChromeExtensionTools.js',
            zestRoot + 'zsVirtualKeyboard.js',
            zestRoot + 'directives/**/*.js',
            zestRoot + 'filters/*.js',
            zestRoot + 'constants/**/*.js',
            zestRoot + 'zsCardOperations.js',
            zestRoot + 'zsSwipeOperations.js',
            zestRoot + 'zsMLIOperations.js',
            zestRoot + 'services_v2/**/*.js',
            zestRoot + 'routers_v2/**/*.js',
            zestRoot + 'controllers_v2/**/*.js',
            paymentRoot + "constants/payConfig.js",
            paymentRoot + 'payApp.js',
            paymentRoot + "constants/paymentConstants.js",
            paymentRoot + "constants/paymentEventConstants.js",
            paymentRoot + "controllers/**/*.js",
            paymentRoot + "directives/**/*.js",
            paymentRoot + "services/**/*.js",
            paymentRoot + "payAppInit.js"
        ],

        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '../payment/**/*.js': ['babel']
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
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
