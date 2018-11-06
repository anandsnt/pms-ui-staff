module.exports = function(gulp, $, options) {

    var runSequence             = require('run-sequence'),
        GUESTWEB_TEMPLATE_ROOT  = '../views/layouts/',
        GUESTWEB_HTML_FILE         = GUESTWEB_TEMPLATE_ROOT + 'guestweb.html',
        _ = require('lodash');

    _.extend(options, {
        'GUESTWEB_TEMPLATE_ROOT': GUESTWEB_TEMPLATE_ROOT,
        'GUESTWEB_HTML_FILE': GUESTWEB_HTML_FILE
    });

    require('./guestweb/guestweb_js_gulp')(gulp, $, options);
    require('./guestweb/guestweb_css_gulp')(gulp, $, options);
    require('./guestweb/guestweb_template_gulp')(gulp, $, options);

    gulp.task('watch-guestweb-files', ['guestweb-watch-partials', 'guestweb-watch-css-files', 'guestweb-watch-js-files']);
    gulp.task('copy-guestweb-files', ['guestweb-copy-js-files', 'guestweb-copy-css-files-dev']);

    gulp.task('copy-guestweb-base-html', function(){
        return gulp.src(GUESTWEB_HTML_FILE)
            .pipe(gulp.dest(options['DEST_ROOT_PATH']+'guestweb'));
    });
    // //TASKS
    gulp.task('build-guestweb-dev', ['build-guestweb-js-dev', 'guestweb-template-cache-dev-v2', 'guestweb-template-cache-dev' , 'build-guestweb-css-dev'
        ]);
    
    gulp.task('guestweb-inject-assets-to-templates', function(callback){
        return runSequence('create-statemapping-and-inject-guestweb-js-production', 'create-theme-mapping-template-production', 
        'create-theme-mapping-css-production', callback);
    });

    gulp.task('guestweb-asset-prod-precompile', function (callback) {
        return runSequence('guestweb-js-production', 'guestweb-template-theme-generate-mapping-list-prod',
            'guestweb-template-theme-generate-mapping-list-prod-v2', 'guestweb-css-theme-generate-mapping-list-prod', 'guestweb-copy-css-files-dev', callback);
    });
}
