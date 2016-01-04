module.exports = function(gulp, $, options) {

	var runSequence = require('run-sequence');

	require('./admin/admin_js_gulp')(gulp, $, options);
	require('./admin/admin_css_gulp')(gulp, $, options);
	require('./admin/admin_template_gulp')(gulp, $, options);
	require('./admin/admin_translation_files_gulp')(gulp, $, options);

	gulp.task('watch-admin-files', ['admin-watch-js-files', 'admin-watch-templates-files', 
		'admin-watch-translation-files', 'admin-watch-less-files']);

	//TASKS
	gulp.task('build-admin-dev', ['build-admin-less-js-dev', 'build-admin-template-cache-dev', 
		'concat-translation-en-admin-files-dev']);

	gulp.task('admin-inject-assets-to-templates', function() { 
		return runSequence( 'inject-admin-js-production-to-template', 
		'inject-admin-template-cache-production-to-template', 
		'inject-admin-less-production-to-template');
	});

	gulp.task('admin-asset-prod-precompile', ['compile-admin-js-production', 'admin-template-cache-production',
	 'admin-less-production', 'concat-translation-en-admin-files-dev']); 
}