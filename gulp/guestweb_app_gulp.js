module.exports = function(gulp, $, options) {

	// require('./guestweb/guestweb_js_gulp')(gulp, $, options);
	require('./guestweb/guestweb_css_gulp')(gulp, $, options);
	require('./guestweb/guestweb_template_gulp')(gulp, $, options);

	// gulp.task('watch-guestweb-files', ['guestweb-watch-partials', 'guestweb-watch-less-files', 'guestweb-watch-js-files']);
	// gulp.task('copy-guestweb-files', ['guestweb-copy-js-files', 'guestweb-copy-less-files']);

	// //TASKS
	// gulp.task('build-guestweb-dev', ['build-guestweb-js-dev', 'build-guestweb-template-cache-dev', 'build-guestweb-less-dev']);
	// gulp.task('guestweb-asset-precompile', ['build-guestweb-js-production', 'build-guestweb-template-cache-production', 
	// 	'build-guestweb-less-production']);
}