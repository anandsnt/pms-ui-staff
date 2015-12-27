module.exports = function(gulp, $, options) {
	
	require('./zest/zest_js_gulp')(gulp, $, options);
	require('./zest/zest_template_gulp')(gulp, $, options);
	require('./zest/zest_css_gulp')(gulp, $, options);
	require('./zest/zest_translation_files_gulp')(gulp, $, options);
	
	var production_tasks = ['build-zest-js-production', 'build-zest-less-production','build-zest-template-cache-production',
		'concat-translation-en-zest-files-dev'];

	gulp.task('watch-zest-files', ['zest-watch-js-files', 'zest-watch-templates-files', 
		'zest-watch-translation-files', 'zest-watch-less-files']);

	 gulp.task('copy-zest-files', ['zest-copy-js-files', 'zest-copy-less-files'])
	// //TASKS
	 gulp.task('build-zest-dev', ['build-zest-less-js-dev', 'build-zest-template-cache-dev', 
		'concat-translation-en-zest-files-dev', 'zest-generate-mapping-list-dev']);
	
	gulp.task('zest-asset-precompile', production_tasks);
}