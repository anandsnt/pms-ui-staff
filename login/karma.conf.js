module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'login');

    config.set(merge(baseConfig, {
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
        ]
    }));
};
