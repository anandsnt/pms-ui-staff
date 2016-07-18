module.exports = function (gulp, $, options) {

    var DEST_ROOT_PATH = options['DEST_ROOT_PATH'],
        URL_APPENDER = options['URL_APPENDER'],
        PAYMENT_TEMPLATES_FILE = 'payment_templates.js',
        PAYMENT_TEMPLATE_ROOT = options['PAYMENT_TEMPLATE_ROOT'],
        PAYMENT_PARTIALS = ['partials/**/*.html'];



    /*******************************************************************************************************************
     *
     *                                  LOCAL DEVELOPMENT ENV TASKS
     *
     ******************************************************************************************************************/

    // Watch
    gulp.task('payment-watch-partials', function () {
        return gulp.watch(PAYMENT_PARTIALS, ['build-payment-template-cache-dev']);
    });

    //Build
    gulp.task('build-payment-template-cache-dev', function () {
        return gulp.src(PAYMENT_PARTIALS, {cwd: 'payment/'})
            .pipe($.templateCache(PAYMENT_TEMPLATES_FILE, {
                module: 'sntPay',
                root: URL_APPENDER + "/partials/"
            }))
            .pipe(gulp.dest(DEST_ROOT_PATH));
    });

};