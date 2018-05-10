module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'gw');

    config.set(merge(baseConfig, {
        // list of files / patterns to load in the browser
        files: [
            '../shared/lib-legacy/js/jquery.min.js',
            '../shared/lib-legacy/js/underscore.min.js',
            '../shared/lib-legacy/js/angular.min.js',
            '../shared/lib-legacy/js/angular-ui-router.min.js',
            '../shared/lib-legacy/js/bootstrap.min.js',
            '../shared/lib-legacy/js/ui-bootstrap-tpls-0.10.0.js',
            '../shared/lib-legacy/js/angular-sanitize.min.js',
            '../shared/lib/js/angular-mocks.js',
            './utility/gwUtil.js',
            './utility/gwThemingUtility.js',
            './gwApp.js',
            './gwAppConfig.js',
            './routers/**/*.js',
            './scripts/angular-pickdate.js',
            './services/**/*.js',
            './controllers/**/*.js'
        ],

        preprocessors: {
            '../guestweb/**/!(*spec).js': ['coverage']
        }
    }));
};
