module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    let sharedRoot = '../shared/',
        jsLegacyLibRoot = sharedRoot + 'lib-legacy/js/',
        jsLibRoot = sharedRoot + 'lib/js/',
        zestRoot = './',
        paymentRoot = '../payment/';

    baseConfig = baseConfig(config, 'zs');

    config.set(merge(baseConfig, {

        // list of files / patterns to load in the browser
        files: [
            jsLibRoot + 'jquery.min.js',
            jsLibRoot + 'jquery-ui.min.js',
            jsLibRoot + 'jquery.ui.touch-punch.min.js',
            jsLibRoot + 'angular.1.7.7.min.js',
            jsLibRoot + 'angular-route.1.7.7.min.js',
            jsLibRoot + 'angular-ui-router.1.0.22.min.js',
            jsLibRoot + 'angular-animate.1.7.7.min.js',
            jsLibRoot + 'angular-sanitize.1.7.7.min.js',
            jsLibRoot + 'angular-translate.2.18.1.min.js',
            jsLibRoot + 'angular-translate-loader-static-files.2.18.1.min.js',
            sharedRoot + 'lib/js/angular-mocks.1.7.7.js',
            jsLegacyLibRoot + 'ui-utils.min.js',
            jsLegacyLibRoot + 'underscore.min.js',
            jsLegacyLibRoot + 'ngDialog.min.js',
            jsLegacyLibRoot + 'fastclick.min.js',
            jsLegacyLibRoot + 'signature/**/*.js',
            jsLegacyLibRoot + 'fullcalender/**/*.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-mobile.min.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-navigation.min.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-previewkeyset.min.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-scramble.min.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-typing.min.js',
            jsLegacyLibRoot + 'stationKeyboard/jquery.keyboard.min.js',
            jsLegacyLibRoot + 'stationKeyboard/jquery.mousewheel.min.js',
            jsLegacyLibRoot +
            'stationKeyboard/jquery.keyboard.extension-autocomplete.min.js',
            jsLegacyLibRoot + 'oclazyload/ocLazyLoad.min.js',
            jsLegacyLibRoot + 'iscroll.js',
            jsLegacyLibRoot + 'ng-iscroll.js',
            jsLegacyLibRoot + 'Utils.js',
            jsLegacyLibRoot + 'jquery.select-to-autocomplete.js',
            sharedRoot + 'interceptors/**/*.js',
            sharedRoot + 'directives/documentTouchMovePrevent/*.js',
            sharedRoot + 'directives/divTouchMoveStopPropogate/*.js',
            sharedRoot + 'directives/orientationInputBlur/*.js',
            sharedRoot + 'directives/iScrollFixes/iscrollStopPropagation.js',
            sharedRoot + 'directives/touchPress/touchPress.js',
            sharedRoot + 'directives/enterPress/enterPress.js',
            sharedRoot + 'directives/clickTouch/clickTouch.js',
            sharedRoot + 'directives/activityIndicator/sntActivityIndicator.js',
            sharedRoot + 'sntCanvasUtil/**/*.js',
            jsLegacyLibRoot + 'date.js',
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
            paymentRoot + 'constants/payConfig.js',
            sharedRoot + 'sntIDCollection/sntIDCollectionApp.js',
            sharedRoot + 'sntIDCollection/services/*.js',
            sharedRoot + 'sntIDCollection/constants/*.js',
            sharedRoot + 'sntIDCollection/controllers/*.js',
            paymentRoot + 'payApp.js',
            paymentRoot + 'constants/paymentConstants.js',
            paymentRoot + 'constants/paymentEventConstants.js',
            paymentRoot + 'controllers/**/*.js',
            paymentRoot + 'directives/**/*.js',
            paymentRoot + 'services/**/*.js',
            paymentRoot + 'payAppInit.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '../payment/**/*.js': ['babel']
        }
    }));
};
