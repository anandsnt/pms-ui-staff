module.exports = function(config) {
    let baseConfig = require('../karma.common.config');
    const merge = require('deepmerge');

    baseConfig = baseConfig(config, 'shared');

    config.set(merge(baseConfig, {
        // list of files / patterns to load in the browser
        files: [
            './lib/js/angular.min.js',
            './lib/js/angular-ui-router.min.js',
            './lib/js/angular-mocks.js',
            './directives/activityIndicator/**/*.js',
            './sntCurrency/*.js'
        ],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        }
    }));
};
