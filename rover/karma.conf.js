module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'rover');

    config.set(merge(baseConfig, {
        // list of files / patterns to load in the browser
        files: [
            '../shared/lib/js/jquery.min.js',
            '../shared/lib/js/jquery-ui.min.js',
            '../shared/lib/js/jquery.ui.touch-punch.min.js',
            '../shared/lib/js/angular.1.7.7.min.js',
            '../shared/lib/js/angular-route.1.7.7.min.js',
            '../shared/lib/js/angular-ui-router.1.0.15.min.js',
            '../shared/lib/js/angular-animate.1.7.7.min.js',
            '../shared/lib/js/angular-dragdrop.min.js',
            '../shared/lib/js/angular-mocks.js',
            '../shared/lib/js/angular-sanitize.1.7.7.min.js',
            '../shared/lib/js/angular-translate.2.18.1.min.js',
            '../shared/lib/js/angular-translate-loader-static-files.2.18.1.min.js',
            '../shared/lib/js/oclazyload/ocLazyLoad.min.js',
            '../shared/lib/js/ui-utils.min.js',
            '../shared/lib/js/underscore.min.js',
            '../shared/lib/js/iscroll.js',
            '../shared/lib/js/ng-iscroll.js',
            '../shared/lib/js/ngDialog.min.js',
            '../shared/lib/js/fastclick/fastclick.min.js',
            '../shared/lib/js/moment.min.js',
            '../shared/lib/js/date.js',
            '../shared/baseCtrl.js',
            '../shared/directives/documentTouchMovePrevent/*.js',
            '../shared/directives/clickTouch/*.js',
            '../shared/directives/divTouchMoveStopPropogate/*.js',
            '../shared/interceptors/**/*.js',
            '../shared/directives/**/*.js',
            '../shared/sntTransitionManager/**/*.js',
            '../shared/lib/js/Utils.js',
            '../shared/sntCanvasUtil/**/*.js',
            '../shared/sntUtils/app.js',
            '../shared/sntUtils/**/*.js',
            '../payment/constants/payConfig.js',
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
            './factories/**/*.js',
            './filters/*.js',
            '../shared/sntCurrency/sntCurrencyFilter.js',
            '../shared/baseCtrl.js',
            './partials/**/*.html',
            '../shared/directives/restrictMinVal/restrictMinValDir.js',
            '../shared/lib/js/sortable.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '../payment/**/*.js': ['babel'],
            './controllers/**/*.js': ['babel'],
            './services/rateManager_/rvRateManagerCoreSrv.js': ['babel'],
            './partials/**/*.html': ['ng-html2js'],
            './services/likes/**/*.js': ['browserify']
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        browserify: {
            plugin: ['tsify']
        }
    }));
};
