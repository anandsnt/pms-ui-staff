module.exports = function (gulp, $, options) {


    require('./payment/payment_js_gulp')(gulp, $, options);
    require('./payment/payment_template_gulp')(gulp, $, options);

    //TASKS
    // -- for LOCAL DEV ENV

    gulp.task('watch-payment-files', ['payment-watch-partials', 'payment-watch-js-files']);

    gulp.task('build-payment-dev', ['build-payment-template-cache-dev', 'payment-generate-mapping-list-dev']);

    // -- for STAGING & PROD ENV
    gulp.task('payment-asset-prod-precompile', ['payment-build-js-prod', 'payment-template-cache-production']);
};