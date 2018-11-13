module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    let sharedRoot = '../shared/',
        jsLibRoot = sharedRoot + 'lib-legacy/js/',
        zestRoot = './',
        paymentRoot = '../payment/';

    baseConfig = baseConfig(config, 'zs');

    config.set(merge(baseConfig, {

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
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-mobile.min.js',
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-navigation.min.js',
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-previewkeyset.min.js',
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-scramble.min.js',
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-typing.min.js',
            jsLibRoot + 'stationKeyboard/jquery.keyboard.min.js',
            jsLibRoot + 'stationKeyboard/jquery.mousewheel.min.js',
            jsLibRoot +
            'stationKeyboard/jquery.keyboard.extension-autocomplete.min.js',
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
