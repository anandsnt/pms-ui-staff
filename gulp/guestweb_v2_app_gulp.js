module.exports = function(gulp, $, options) {

    var runSequence         = require('run-sequence'),
        GUESTWEB_V2_TEMPLATE_ROOT  = '../views/layouts/',
        GUESTWEB_V2_HTML_FILE         = GUESTWEB_V2_TEMPLATE_ROOT + 'guestweb_v2.html',
        _ = require('lodash');

    _.extend(options, {
        'GUESTWEB_V2_TEMPLATE_ROOT': GUESTWEB_V2_TEMPLATE_ROOT,
        'GUESTWEB_V2_HTML_FILE': GUESTWEB_V2_HTML_FILE
    });

    require('./guestweb_v2/guestweb_v2_js_gulp')(gulp, $, options);
    require('./guestweb_v2/guestweb_v2_css_gulp')(gulp, $, options);
    require('./guestweb_v2/guestweb_v2_template_gulp')(gulp, $, options);

    gulp.task('watch-guestweb-v2-files', ['guestweb-v2-watch-partials', 'guestweb-v2-watch-less-files', 'guestweb-v2-watch-js-files']);
    gulp.task('copy-guestweb-v2-files', ['guestweb-v2-copy-js-files', 'guestweb-v2-copy-less-files']);

    //TASKS
    gulp.task('build-guestweb-v2-dev', function(callback){
        return runSequence(['build-guestweb-v2-template-cache-dev', 'build-guestweb-v2-less-js-dev'], 'copy-guestweb-v2-base-html', callback);
    });
    

    gulp.task('copy-guestweb-v2-base-html', function(){
        return gulp.src(GUESTWEB_V2_HTML_FILE)
            .pipe(gulp.dest(options['DEST_ROOT_PATH']+'guestweb_v2'));
    });

    gulp.task('guestweb-v2-inject-assets-to-templates', function(callback){
        return runSequence('inject-guestweb-v2-js-production-to-template', 
        'inject-guestweb-v2-template-cache-production-to-template', 
        'inject-guestweb-v2-less-production-to-template', callback);
    });

    gulp.task('guestweb-v2-asset-prod-precompile', ['compile-guestweb-v2-js-production', 'guestweb-v2-template-cache-production',
     'guestweb-v2-less-production']);     
}