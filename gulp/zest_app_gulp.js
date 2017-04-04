module.exports = function(gulp, $, options) {
    
    var runSequence = require('run-sequence'),
        ZEST_TEMPLATE_ROOT         = '../views/zest_station/home/',
        ZEST_HTML_FILE             = ZEST_TEMPLATE_ROOT + 'index.html';

    require('./zest/zest_js_gulp')(gulp, $, options);
    require('./zest/zest_template_gulp')(gulp, $, options);
    require('./zest/zest_css_gulp')(gulp, $, options);
    require('./zest/zest_translation_files_gulp')(gulp, $, options);
    
    gulp.task('zest-inject-assets-to-templates', function(callback){
        return runSequence('inject-zest-js-production-to-template', 'inject-zest-template-cache-production-to-template', 
         'copy-transaltion-files-for-zeststation', 'create-zest-theme-mapping-css-production', callback);
    });

    gulp.task('copy-zest-base-html', function(){
        return gulp.src(ZEST_HTML_FILE)
            .pipe(gulp.dest(options['DEST_ROOT_PATH']+'zest_station'));
    });

    gulp.task('zest-asset-prod-precompile', ['compile-zest-js-production', 'zest-template-cache-production',
     'zeststation-css-theme-generate-mapping-list-prod']);

    gulp.task('watch-zest-files', ['zest-watch-js-files', 'zest-watch-templates-files', 
        'zest-watch-translation-files', 'zeststation-watch-css-files']);

     gulp.task('copy-zest-files', ['zest-copy-js-files', 'zest-copy-less-files'])

     gulp.task('build-zest-dev', ['build-zeststation-js-dev', 'build-zest-template-cache-dev', 'build-zeststation-css-dev', 'copy-transaltion-files-for-zeststation']);

    
    // gulp.task('watch-zeststation-files', ['zeststation-watch-partials', 'zeststation-watch-less-files', 'zeststation-watch-js-files']);
    gulp.task('copy-zeststation-files', ['zeststation-copy-js-files', 'zeststation-copy-css-files-dev']); 

}