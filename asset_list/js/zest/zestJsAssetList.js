module.exports = {
    getList: function() {
        var sharedRoot = 'shared/',
            jsLibRoot = sharedRoot + 'lib/js/',
            zestRoot = 'zest_station/',
            paymentRoot = 'payment/',

            adminJsAssets = {
                minifiedFiles: [
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

                    jsLibRoot + 'ui-utils.min.js',
                    jsLibRoot + 'underscore.min.js',
                    jsLibRoot + 'ngDialog.min.js',
                    jsLibRoot + 'fastclick/fastclick.min.js',
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
                    sharedRoot + 'lib/js/moment.min.js'

                ],
                nonMinifiedFiles: [
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
                    sharedRoot + 'directives/activityIndicator/**/*.js',
                    jsLibRoot + 'date.js',
                    sharedRoot + 'sntIDCollection/sntIDCollectionApp.js',
                    sharedRoot + 'sntIDCollection/services/*.js',
                    sharedRoot + 'sntIDCollection/constants/*.js',
                    sharedRoot + 'sntIDCollection/controllers/*.js',
                    sharedRoot + 'sntCanvasUtil/**/*.js',
                    sharedRoot + 'sntUtils/app.js',
                    sharedRoot + 'sntUtils/**/*.js',
                    // sharedRoot + 'cordova.js',
                    zestRoot + 'zsApp.js',
                    zestRoot + 'zsUtils.js',
                    zestRoot + 'zsWebSocketActions.js',
                    zestRoot + 'zsChromeAppActions.js',
                    zestRoot + 'zsChromeExtensionTools.js',
                    zestRoot + 'zsVirtualKeyboard.js',
                    zestRoot + 'controllers_v2/**/*.js',
                    zestRoot + 'directives/**/*.js',
                    zestRoot + 'services_v2/**/*.js',
                    zestRoot + 'filters/*.js',
                    zestRoot + 'routers_v2/**/*.js',
                    zestRoot + 'constants/**/*.js',
                    zestRoot + 'zsCardOperations.js',
                    zestRoot + 'zsSwipeOperations.js',
                    zestRoot + 'zsMLIOperations.js',
                    '!**/*.spec.js',
                    '!**/*.conf.js'
                ],
                preCompiledFiles: [
                    paymentRoot + 'constants/payConfig.js',
                    paymentRoot + 'payApp.js',
                    paymentRoot + 'constants/paymentConstants.js',
                    paymentRoot + 'constants/paymentEventConstants.js',
                    paymentRoot + 'controllers/**/*.js',
                    paymentRoot + 'directives/**/*.js',
                    paymentRoot + 'services/**/*.js',
                    paymentRoot + 'payAppInit.js'
                ]
            };

        return adminJsAssets;
    }
};
