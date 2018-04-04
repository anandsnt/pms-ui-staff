module.exports = function (gulp, $, options) {

    'use strict';
    var MANIFEST_DIR = __dirname + "/payment/manifests/",
        generated = "____generated",
        newJsonFileName = '../../public/assets/asset_list/____generatedgatewayJsMappings/____generatedpayment/____generatedpaymentTemplateJsMappings.json',
        _ = require('lodash');

    _.extend(options, {
        'PAYMENT_JS_MANIFEST_FILE': 'payment_js_manifest.json',
        'PAYMENT_TEMPLTE_MANFEST_FILE': 'payment_template_manifest.json',
        'PAYMENT_TEMPLATES_FILE': 'payment_templates.js',
        'MANIFEST_DIR': MANIFEST_DIR,
        'paymentGeneratedDir': options.DEST_ROOT_PATH + 'asset_list/' +
        generated + 'gatewayJsMappings/' + generated + 'payment/'
    });

    options.paymentGeneratedFile = options.paymentGeneratedDir + generated +
        'paymentJsMappings.json';

    require('./payment/payment_js_gulp')(gulp, $, options);
    require('./payment/payment_template_gulp')(gulp, $, options);

    //TASKS
    // -- for LOCAL DEV ENV

    /**
     * function to create the json file which has both the js & template file
     * this file will be getting called from wherever the module injected
     * @return {undefined}
     */
    var createJSONFileForLazyLoadingForDev = function () {
        var edit = require('gulp-json-editor'), 
            es = require('event-stream'),
            fs = require('fs'),
            $q = require('q');

        var deferred = $q.defer();

        var jsJsonFileContent = {};
        var jsJsonFile = gulp.src(options.paymentGeneratedFile)
                        .pipe(edit(function(manifest){
                            jsJsonFileContent = manifest;
                            return manifest;
                        }));

        
        es.merge(jsJsonFile).on('end', function(data) {
            
            var fileContent = {
                js: jsJsonFileContent,
                template: [options.URL_APPENDER + "/" + options.PAYMENT_TEMPLATES_FILE]
            }

            fs.writeFile(newJsonFileName, JSON.stringify(fileContent), function(err) {
                if(err) {
                    return console.error('payment JS and Template mapping file failed!! (' + err + ')');
                }
                console.log('payment JS and Template mapping file created ( )');
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    gulp.task('watch-payment-files', ['payment-watch-partials', 'payment-watch-js-files']);

    gulp.task('build-payment-dev', ['build-payment-template-cache-dev', 'payment-generate-mapping-list-dev'], createJSONFileForLazyLoadingForDev);


    /**
     * function to create the json file which has both the js & template file
     * this file will be getting called from wherever the module injected
     * @return {undefined}
     */
    var createJSONFileForLazyLoadingForProd = function () {
        var edit = require('gulp-json-editor'), 
            es = require('event-stream'),
            fs = require('fs'),
            $q = require('q');

        var jsJsonFileContent = {};
        var jsJsonFile = gulp.src(options.paymentGeneratedFile)
                        .pipe(edit(function(manifest){
                            jsJsonFileContent = manifest;
                            return manifest;
                        }));
        
        var templateJsonFileContent = {};
        var templateJsonFile = gulp.src(MANIFEST_DIR + options.PAYMENT_TEMPLTE_MANFEST_FILE)
                        .pipe(edit(function(manifest){
                            templateJsonFileContent = manifest;
                            return manifest;
                        }));

        var deferred = $q.defer();
        
        es.merge([jsJsonFile, templateJsonFile]).on('end', function(data) {
            
            var fileContent = {
                js: jsJsonFileContent,
                template: [options.URL_APPENDER + "/" +templateJsonFileContent[options.PAYMENT_TEMPLATES_FILE]]
            }

            fs.writeFile(newJsonFileName, JSON.stringify(fileContent), function(err) {
                if(err) {
                    return console.error('payment JS and template mapping file failed!! (' + err + ')');
                }
                console.log('payment JS and template mapping file created ( )');
                deferred.resolve();
            });
            
        });
    return deferred.promise;
    };

    // -- for STAGING & PROD ENV
    gulp.task('payment-asset-prod-precompile', ['payment-generate-mapping-list-prod', 'payment-template-cache-production'], createJSONFileForLazyLoadingForProd);
};