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
            '../shared/lib/js/jquery.qtip.min.js',
            '../shared/lib/js/angular.min.js',
            '../shared/lib/js/angular-mocks.js',
            '../shared/lib/js/angular-route.min.js',
            '../shared/lib/js/angular-ui-router.min.js',
            '../shared/lib/js/angular-animate.min.js',
            '../shared/lib/js/angular-dragdrop.min.js',
            '../shared/lib/js/angular-sanitize.min.js',
            '../shared/lib/js/angular-translate.min.js',
            '../shared/lib/js/angular-translate-loader-static-files.min.js',
            '../shared/lib/js/ui-utils.min.js',
            '../shared/lib/js/underscore.min.js',
            '../shared/lib/js/ngDialog.min.js',
            '../shared/lib/js/spectrum.js',
            '../shared/lib/js/SyntaxHighlighter/shCore.js',
            '../shared/lib/js/SyntaxHighlighter/shBrushXml.js',
            '../shared/lib/js/SyntaxHighlighter/shBrushJScript.js',
            '../shared/lib/js/treeview/ivh-treeview.min.js',
            '../shared/lib/js/moment.min.js',
            '../shared/lib/js/sortable.js',
            '../shared/lib/js/angular-multi-select.js',
            '../shared/lib/js/iscroll.js',
            '../shared/lib/js/ng-iscroll.js',
            '../shared/lib/js/Utils.js',
            '../shared/lib/js/ng-table.js',

            '../shared/interceptors/sharedHttpInterceptor.js',
            '../shared/directives/documentTouchMovePrevent/documentTouchMovePrevent.js',
            '../shared/directives/divTouchMoveStopPropogate/documentTouchMovePrevent.js',
            '../shared/directives/orientationInputBlur/orientationInputBlur.js',
            '../shared/directives/fauxMultiSelect/fauxMutilSelect.js',
            '../shared/directives/eventReachedRoot/eventReachedRoot.js',
            '../shared/directives/ngClassWithoutAnimation/ngClassWithoutAnimation.js',
            '../shared/directives/convertToNumber/convertToNumberDir.js',
            '../shared/directives/tooltip/qtip2.js',

            '../shared/baseCtrl.js',
            '../shared/iBeaconOperations.js',

            '../shared/lib/js/date.js',

            './adRouter/adChainRouter.js',
            './adRouter/adminInterfacesRouter.js',
            './adRouter/adminToolsRouter.js',
            './adRouter/adminZestStationRouter.js',
            './adRouter/adRouterOne.js',
            './adRouter/adRouterTwo.js',
            '../shared/directives/uiColorpicker/uiColorpicker.js',
            '../shared/directives/onScroll/onScroll.js',
            '../shared/directives/limitInputRange/limitInputRange.js',

            './adApp.js',
            './adRouter.js',
            './adUtils.js',

            '../rover/rvSntApp.js',

            './controllers/**/*.js',

            './directives/**/*.js',

            './services/**/*.js',

            './filters/highlightWordsFilter.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './controllers/**/*.js': ['babel'],
            './services/**/*.js': ['babel']
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
