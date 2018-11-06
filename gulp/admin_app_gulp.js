module.exports = function(gulp, $, options) {

    var runSequence             = require('run-sequence');
    var ADMIN_TEMPLATE_ROOT     = '../views/admin/settings/',
        ADMIN_HTML_FILE         = ADMIN_TEMPLATE_ROOT + 'settings.html',
        _ = require('lodash');

    _.extend(options, {
        'ADMIN_TEMPLATE_ROOT': ADMIN_TEMPLATE_ROOT,
        'ADMIN_HTML_FILE': ADMIN_HTML_FILE
    });

    require('./admin/admin_js_gulp')(gulp, $, options);
    require('./admin/admin_css_gulp')(gulp, $, options);
    require('./admin/admin_template_gulp')(gulp, $, options);
    require('./admin/admin_translation_files_gulp')(gulp, $, options);

    gulp.task('watch-admin-files', ['admin-watch-js-files', 'admin-watch-templates-files', 
        'admin-watch-translation-files', 'admin-watch-less-files']);

    gulp.task('copy-admin-base-html', function(){
        return gulp.src(ADMIN_HTML_FILE)
            .pipe(gulp.dest(options['DEST_ROOT_PATH']+'admin'));
    });

    //TASKS
    gulp.task('build-admin-dev', function(callback){
        return runSequence(['build-admin-less-js-dev', 'build-admin-template-cache-dev', 
        'concat-translation-en-admin-files-dev'], 'copy-admin-base-html', callback);
    });

    gulp.task('admin-inject-assets-to-templates', function(callback) { 
        return runSequence( 'inject-admin-js-production-to-template', 
        'inject-admin-template-cache-production-to-template', 
        'inject-admin-less-production-to-template', callback);
    });

    gulp.task('admin-asset-prod-precompile', ['compile-admin-js-production', 'admin-template-cache-production',
     'admin-less-production', 'concat-translation-en-admin-files-dev']); 
}