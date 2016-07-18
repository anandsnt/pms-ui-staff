module.exports = function (gulp, $, options) {

    var DEST_ROOT_PATH = options['DEST_ROOT_PATH'],
        URL_APPENDER = options['URL_APPENDER'],
        MANIFEST_DIR = __dirname + "/manifests/",
        PAYMENT_JS_COMBINED_FILE = 'payment.js',
        PAYMENT_TEMPLATE_ROOT = options['PAYMENT_TEMPLATE_ROOT'],
        PAYMENT_HTML_FILE = options['PAYMENT_HTML_FILE'],
        PAYMENT_JS_MANIFEST_FILE = "payment_js_manifest.json",
        onError = options.onError,
        runSequence = require('run-sequence'),
        extendedMappings = {},
        generated = "____generated",
        PAYMENT_JS_LIST = require("../../asset_list/js/payment/paymentsJsAssetList").getList(),
        _ = require('lodash'),
        paymentGeneratedDir = DEST_ROOT_PATH + 'asset_list/' + generated + 'gatewayJsMappings/' + generated + 'payment/',
        paymentGeneratedFile = paymentGeneratedDir + generated + 'paymentJsMappings.json';


    gulp.task('build-payment-js-dev', ['payment-copy-js-files'], function () {

        var glob = require('glob-all'),
            es = require('event-stream'),
            stream = require('merge-stream'),
            edit = require('gulp-json-editor');

        var tasks = Object.keys(PAYMENT_JS_LIST).map(function (paymentProvider) {

            var filesList = _.reduce(PAYMENT_JS_LIST, function (a, b) {
                return a.concat(b);
            }, []);

            return gulp.src(filesList)
                .pipe($.jsvalidate())
                .pipe($.babel());
        });

        return es.merge(tasks);
    });

    gulp.task('payment-copy-js-files', function () {
        var filesList = _.reduce(PAYMENT_JS_LIST, function (a, b) {
            return a.concat(b);
        }, []);

        console.log(filesList);

        return gulp.src(filesList, {base: '.'})
            .pipe(gulp.dest(DEST_ROOT_PATH, {overwrite: true}));
    });

    gulp.task('payment-watch-js-files', function () {
        var filesList = _.reduce(PAYMENT_JS_LIST, function (a, b) {
            return a.concat(b);
        }, []);

        console.log(filesList);

        gulp.watch(filesList, function () {
            return runSequence('build-payment-js-dev');
        });
    });

    gulp.task('payment-generate-mapping-list-dev', ['payment-copy-js-files'], function(){
        var glob 		= require('glob-all'),
            fs 			= require('fs'),
            mkdirp 		= require('mkdirp'),
            extendedMappings = {};

        mkdirp(paymentGeneratedDir, function (err) {
            if (err) {
                console.error('rover JS mapping directory failed!! (' + err + ')');
            } else {
                console.log('rover JS mapping directory created (' + paymentGeneratedDir + ')');
            }

            fs.writeFile(paymentGeneratedFile, JSON.stringify(extendedMappings), function(err) {
                if(err) {
                    return console.error('rover JS mapping file failed!! (' + err + ')');
                }
                console.log('rover JS mapping file created (' + paymentGeneratedFile + ')');
            });
        });
    });

    //JS - END
};