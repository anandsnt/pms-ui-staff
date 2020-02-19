module.exports = {
    getList: function() {
        var sharedRoot = 'shared/',
            jsLibRoot = sharedRoot + 'lib/js/',
            loginRoot = 'login/',
            // remove ref when virtual keyboard files have updated loading
            loginJsAssets = {
                minifiedFiles: [
                    jsLibRoot + 'angular.min.js',
                    jsLibRoot + 'angular-ui-router.min.js',
                    jsLibRoot + 'angular-sanitize.min.js',
                    jsLibRoot + 'ngDialog.min.js',
                    jsLibRoot + 'jquery.min.js'
                ],
                nonMinifiedFiles: [
                    sharedRoot + 'directives/documentTouchMovePrevent/*.js',
                    sharedRoot + 'directives/clickTouch/clickTouch.js',
                    sharedRoot + 'baseCtrl.js',
                    sharedRoot + 'interceptors/**/*.js',

                    jsLibRoot + 'iscroll.js',
                    jsLibRoot + 'ng-iscroll.js',
                    jsLibRoot + 'Utils.js',
                    loginRoot + 'loginApp.js',
                    loginRoot + 'loginRouter.js',
                    loginRoot + '**/*.js',

                    '!' + loginRoot + 'loginJsAssetList.js',
                    // Eliminate all spec files
                    '!**/*.spec.js',
                    '!**/*.conf.js'
                ]
            };

        return loginJsAssets;
    }
};
