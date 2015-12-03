module.exports = function(gulp, $, options) {
	
	require('./rover/rover_js_gulp')(gulp, $, options);
	require('./rover/rover_template_gulp')(gulp, $, options);
	require('./rover/rover_css_gulp')(gulp, $, options);
	require('./rover/rover_translation_files_gulp')(gulp, $, options);

	var runSequence = require('run-sequence');
	var production_tasks = ['build-rover-js-production', 'rover-generate-mapping-list-prod', 
				'build-rover-template-cache-production', 'build-rover-less-production', 
				'concat-translation-en-files-dev'];

	gulp.task('watch-rover-files', ['rover-watch-js-files', 'rover-watch-templates-files', 
		'rover-watch-translation-files', 'rover-watch-less-files']);

	//TASKS
	gulp.task('build-rover-dev', ['build-rover-less-js-dev', 'build-rover-template-cache-dev', 
		'concat-translation-en-files-dev', 'rover-generate-mapping-list-dev']);
	
	gulp.task('rover-asset-precompile', ['rover-generate-mapping-list-prod']);
}