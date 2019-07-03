module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'pay');

    config.set(merge(baseConfig, {

        // list of files / patterns to load in the browser
        files: [
            '../shared/lib/js/jquery.min.js',
            '../shared/lib/js/underscore.min.js',
            '../shared/lib/js/angular.min.js',
            '../shared/lib/js/angular-ui-router.min.js',
            '../shared/lib/js/angular-mocks.js',
            '../shared/lib/js/iscroll.js',
            '../shared/lib/js/ng-iscroll.js',
            '../shared/lib/js/ngDialog.min.js',
            '../shared/lib/js/oclazyload/ocLazyLoad.min.js',
            '../shared/lib/js/angular-translate.min.js',
            './payApp.js',
            '../shared/directives/activityIndicator/sntActivityIndicator.js',
            './constants/payConfig.js',
            '../shared/interceptors/**/*.js',
            './constants/*.js',
            './services/*.js',
            './controllers/*.js',
            './specs/*.spec.js'
        ],
        preprocessors: {
            './services/*.js': ['babel'],
            './controllers/*.js': ['babel'],
            './specs/*.spec.js': ['babel']
        }
    }));
};
