module.exports = function(gulp, $, options) {

    var runSequence = require('run-sequence'),
        ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
        ROVER_HTML_FILE         = ROVER_TEMPLATE_ROOT + 'rover.html',
        _ = require('lodash');

    _.extend(options, {
        'ROVER_TEMPLATE_ROOT': ROVER_TEMPLATE_ROOT,
        'ROVER_HTML_FILE': ROVER_HTML_FILE
    });

    
    require('./rover/rover_js_gulp')(gulp, $, options);
    require('./rover/rover_template_gulp')(gulp, $, options);
    require('./rover/rover_css_gulp')(gulp, $, options);
    require('./rover/rover_translation_files_gulp')(gulp, $, options);
    
    gulp.task('watch-rover-files', ['rover-watch-js-files', 'rover-watch-templates-files', 
        'rover-watch-translation-files', 'rover-watch-less-files']);

    gulp.task('copy-rover-files', ['rover-copy-js-files', 'rover-copy-less-files'])
    
    // TASKS
    gulp.task('build-rover-dev', function(callback){
        return runSequence(['build-rover-less-js-dev', 'build-rover-template-cache-dev', 
        'concat-translation-en-rover-files-dev', 'rover-generate-mapping-list-dev'], 'copy-rover-base-html', callback);
    });
    

    gulp.task('copy-rover-base-html', function(){
        return gulp.src(ROVER_HTML_FILE)
            .pipe(gulp.dest(options['DEST_ROOT_PATH'] + 'rover'));
    });

    gulp.task('rover-inject-assets-to-templates', function(callback){
        return runSequence('create-statemapping-and-inject-rover-js-production',
            'inject-rover-less-production-to-template', 
            'inject-rover-template-cache-production-to-template', callback);
    });

    gulp.task('rover-asset-prod-precompile', ['rover-build-js-and-mapping-list-prod', 'rover-template-cache-production',
         'rover-less-production', 'concat-translation-en-rover-files-dev']);
}
