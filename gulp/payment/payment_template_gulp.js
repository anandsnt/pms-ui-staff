module.exports = function (gulp, $, options) {

    var DEST_ROOT_PATH = options['DEST_ROOT_PATH'],
        URL_APPENDER = options['URL_APPENDER'],
        PAYMENT_TEMPLATES_FILE = options['PAYMENT_TEMPLATES_FILE'],
        PAYMENT_TEMPLATE_ROOT = options['PAYMENT_TEMPLATE_ROOT'],
        PAYMENT_PARTIALS = ['**/*.html'],
        PAYMENT_TEMPLTE_MANFEST_FILE = options['PAYMENT_TEMPLTE_MANFEST_FILE'],
        MANIFEST_DIR =  options['MANIFEST_DIR'],
        MODULE_NAME = 'sntPay';



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
                module: MODULE_NAME,
                root: URL_APPENDER
            }))
            .pipe(gulp.dest(DEST_ROOT_PATH));
    });


    //Be careful: PRODUCTION
    gulp.task('payment-template-cache-production', function () {
      return gulp.src(PAYMENT_PARTIALS, {cwd:'payment/'})
            .pipe($.minifyHTML({
                conditionals: true,
                spare:true,
                empty: true
            }))
            .pipe($.templateCache(PAYMENT_TEMPLATES_FILE, {
                module: MODULE_NAME,
                root: URL_APPENDER
            }))
            .pipe($.uglify({compress:true}))
            .pipe($.rev())
            .pipe(gulp.dest(DEST_ROOT_PATH))
            .pipe($.rev.manifest(PAYMENT_TEMPLTE_MANFEST_FILE))
            .pipe(gulp.dest(MANIFEST_DIR));
    }); 

};