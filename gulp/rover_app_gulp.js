module.exports = function(gulp, $, options) {
	
	require('./rover/rover_js_gulp')(gulp, $, options);
	require('./rover/rover_template_gulp')(gulp, $, options);
	require('./rover/rover_css_gulp')(gulp, $, options);
	require('./rover/rover_translation_files_gulp')(gulp, $, options);
	
	var production_tasks = ['build-rover-js-production', 
				'build-rover-template-cache-production', 'build-rover-less-production', 
				'concat-translation-en-rover-files-dev'];

	gulp.task('watch-rover-files', ['rover-watch-js-files', 'rover-watch-templates-files', 
		'rover-watch-translation-files', 'rover-watch-less-files']);

	gulp.task('copy-rover-files', ['rover-copy-js-files', 'rover-copy-less-files'])
	//TASKS
	gulp.task('build-rover-dev', ['build-rover-less-js-dev', 'build-rover-template-cache-dev', 
		'concat-translation-en-rover-files-dev', 'rover-generate-mapping-list-dev']);
	
	gulp.task('rover-asset-precompile', production_tasks);
}