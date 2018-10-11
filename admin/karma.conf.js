module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'admin');

    config.set(merge(baseConfig, {
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
            '../shared/directives/touchPress/touchPress.js',
            '../shared/directives/activityIndicator/sntActivityIndicator.js',

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

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './controllers/**/*.js': ['babel'],
            './services/**/*.js': ['babel']
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        }
    }));
};
