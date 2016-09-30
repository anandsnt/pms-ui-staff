module.exports = function (gulp, $, options) {

    var DEST_ROOT_PATH = options['DEST_ROOT_PATH'],
        URL_APPENDER = options['URL_APPENDER'],
        MANIFEST_DIR = options['MANIFEST_DIR'],
        PAYMENT_JS_COMBINED_FILE = 'payment.js',
        PAYMENT_TEMPLATE_ROOT = options['PAYMENT_TEMPLATE_ROOT'],
        PAYMENT_HTML_FILE = options['PAYMENT_HTML_FILE'],
        PAYMENT_JS_MANIFEST_FILE = options['PAYMENT_JS_MANIFEST_FILE'],
        onError = options.onError,
        runSequence = require('run-sequence'),
        extendedMappings = {},
        paymentMappingFile = "../../asset_list/js/payment/paymentsJsAssetList",
        PAYMENT_JS_LIST = require(paymentMappingFile).getList(),
        _ = require('lodash'),
        paymentGeneratedDir = options.paymentGeneratedDir,
        paymentGeneratedFile = options.paymentGeneratedFile;

    var saveTheMappingJsonFile = function () {
        var glob   = require('glob-all'),
            fs     = require('fs'),
            es     = require('event-stream'),
            mkdirp = require('mkdirp'),
            $q     = require('q');

        var deferred = $q.defer();

        mkdirp(paymentGeneratedDir, function (err) {
            if (err) {
                console.error('payment JS mapping directory failed!! (' + err + ')');
                deferred.reject();
            } else {
                console.log('payment JS mapping directory created (' + paymentGeneratedDir + ')');
            }

            fs.writeFile(paymentGeneratedFile, JSON.stringify(extendedMappings), function (err) {
                if (err) {
                    return console.error('payment JS mapping file failed!! (' + err + ')');
                }
                console.log('payment JS mapping file created (' + paymentGeneratedFile + ')');
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

    //prod task for payment task creation
    gulp.task('build-payment-js-prod', function () {

        var glob = require('glob-all'),
            es = require('event-stream'),
            stream = require('merge-stream'),
            edit = require('gulp-json-editor');

        var tasks = Object.keys(PAYMENT_JS_LIST).map(function (paymentProvider) {

            var fileName = paymentProvider + ".min.js";

            return gulp.src(PAYMENT_JS_LIST[paymentProvider], {base: '.'})
                .pipe($.babel())
                .pipe($.jsvalidate())
                .pipe($.concat(fileName))
                .on('error', onError)
                .pipe($.ngAnnotate({single_quotes: true, debug: true}))
                .on('error', onError)
                .pipe($.uglify({
                    compress: {drop_console: true}, output: {
                        space_colon: false
                    }
                }))
                .on('error', onError)
                .pipe($.rev())
                .pipe(gulp.dest(DEST_ROOT_PATH + 'payment'), {overwrite: true})
                .pipe($.rev.manifest(PAYMENT_JS_MANIFEST_FILE))
                .pipe(edit(function (manifest) {
                    Object.keys(manifest).forEach(function (path, orig) {
                        extendedMappings[paymentProvider] = [URL_APPENDER + "/payment/" + manifest[path]];
                    });
                    console.log('Payment mapping mapping-generation-end: ' + paymentProvider);
                    return extendedMappings;
                }))
                .pipe(gulp.dest(MANIFEST_DIR), {overwrite: true});
        });

        return es.merge(tasks);
    });

    gulp.task('payment-generate-mapping-list-prod', ['build-payment-js-prod'], saveTheMappingJsonFile);

    gulp.task('build-payment-js-dev', function () {

        var glob = require('glob-all'),
            es = require('event-stream'),
            stream = require('merge-stream'),
            edit = require('gulp-json-editor');
        var filesList = _.reduce(PAYMENT_JS_LIST, function (a, b) {
            return a.concat(b);
        }, []);

        var tasks = Object.keys(PAYMENT_JS_LIST).map(function (paymentProvider) {

            extendedMappings[paymentProvider] = glob.sync(PAYMENT_JS_LIST[paymentProvider]).map(function (e) {
                return URL_APPENDER + '/' + e;
            });

            return gulp.src(filesList, {base: '.'})
                .pipe($.babel())
                .pipe($.jsvalidate())
                .pipe(gulp.dest(DEST_ROOT_PATH), {overwrite: true});
        });

        return es.merge(tasks);
    });


    gulp.task('payment-watch-js-files', function () {
        delete require.cache[require.resolve(paymentMappingFile)];
        PAYMENT_JS_LIST = require(paymentMappingFile).getList();

        var filesList = _.reduce(PAYMENT_JS_LIST, function (a, b) {
            return a.concat(b);
        }, []);

        gulp.watch(filesList, ['payment-generate-mapping-list-dev']);
    });

    gulp.task('payment-generate-mapping-list-dev', ['build-payment-js-dev'], saveTheMappingJsonFile);

    //JS - END
};