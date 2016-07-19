module.exports = function (gulp, $, options) {

    'use strict';
    var MANIFEST_DIR = __dirname + "/payment/manifests/",
        _options = require('util')._extend(options);

    _options.PAYMENT_JS_MANIFEST_FILE =  "payment_js_manifest.json";
    _options.PAYMENT_TEMPLTE_MANFEST_FILE = "payment_template_manifest.json";
    _options.MANIFEST_DIR = MANIFEST_DIR;

    require('./payment/payment_js_gulp')(gulp, $, _options);
    require('./payment/payment_template_gulp')(gulp, $, _options);

    //TASKS
    // -- for LOCAL DEV ENV

    /**
     * function to create the json file which has both the js & template file
     * this file will be getting called from wherever the module injected
     * @return {undefined}
     */
    var createJSONFileForLazyLoading = function () {
        var edit = require('gulp-json-editor'), 
            es = require('event-stream'),
            fs = require('fs');

        var jsJsonFileContent = {};
        var jsJsonFile = gulp.src(MANIFEST_DIR + _options.PAYMENT_JS_MANIFEST_FILE)
                        .pipe(edit(function(manifest){
                            jsJsonFileContent = manifest;
                            return manifest;
                        }));
        
        var templateJsonFileContent = {};
        var jsJsonFile = gulp.src(MANIFEST_DIR + _options.PAYMENT_TEMPLTE_MANFEST_FILE)
                        .pipe(edit(function(manifest){
                            templateJsonFileContent = manifest;
                            return manifest;
                        }));

        return es.merge(jsJsonFile).on('end', function(data) {
            console.log(templateJsonFileContent, jsJsonFileContent);
        });
    };

    gulp.task('watch-payment-files', ['payment-watch-partials', 'payment-watch-js-files']);

    gulp.task('build-payment-dev', ['build-payment-template-cache-dev', 'payment-generate-mapping-list-dev'], createJSONFileForLazyLoading);

    // -- for STAGING & PROD ENV
    gulp.task('payment-asset-prod-precompile', ['payment-generate-mapping-list-prod', 'payment-template-cache-production'], createJSONFileForLazyLoading);
};