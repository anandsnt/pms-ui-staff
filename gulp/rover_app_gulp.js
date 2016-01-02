module.exports = function(gulp, $, options) {
	
	require('./rover/rover_js_gulp')(gulp, $, options);
	require('./rover/rover_template_gulp')(gulp, $, options);
	require('./rover/rover_css_gulp')(gulp, $, options);
	require('./rover/rover_translation_files_gulp')(gulp, $, options);
	
	var runSequence = require('run-sequence');

	gulp.task('watch-rover-files', ['rover-watch-js-files', 'rover-watch-templates-files', 
		'rover-watch-translation-files', 'rover-watch-less-files']);

	gulp.task('copy-rover-files', ['rover-copy-js-files', 'rover-copy-less-files'])
	//TASKS
	gulp.task('build-rover-dev', ['build-rover-less-js-dev', 'build-rover-template-cache-dev', 
		'concat-translation-en-rover-files-dev', 'rover-generate-mapping-list-dev']);
	

	gulp.task('rover-inject-assets-to-templates', function(){
		return runSequence('create-statemapping-and-inject-rover-js-production',
			'inject-rover-less-production-to-template', 
			'inject-rover-template-cache-production-to-template');
	});

	gulp.task('rover-asset-prod-precompile', ['rover-build-js-and-mapping-list-prod', 'rover-template-cache-production',
	 	'rover-less-production', 'concat-translation-en-rover-files-dev']);
}