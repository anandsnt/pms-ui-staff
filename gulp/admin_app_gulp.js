module.exports = function(gulp, $, options) {

	require('./admin/admin_js_gulp')(gulp, $, options);
	require('./admin/admin_css_gulp')(gulp, $, options);
	require('./admin/admin_template_gulp')(gulp, $, options);
	require('./admin/admin_translation_files_gulp')(gulp, $, options);

	gulp.task('watch-admin-files', ['admin-watch-js-files', 'admin-watch-templates-files', 
		'admin-watch-translation-files', 'admin-watch-less-files']);

	//TASKS
	gulp.task('build-admin-dev', ['build-admin-less-js-dev', 'build-admin-template-cache-dev', 
		'concat-translation-en-admin-files-dev']);

	gulp.task('admin-asset-precompile', ['build-admin-js-production', 'build-admin-template-cache-production',
	 'build-admin-less-production', 'concat-translation-en-admin-files-dev']); //, 
}