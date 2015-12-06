module.exports = function(gulp, $, options) {

	require('./login/login_js_gulp')(gulp, $, options);
	require('./login/login_css_gulp')(gulp, $, options);
	require('./login/login_template_gulp')(gulp, $, options);

	gulp.task('watch-login-files', ['login-watch-partials', 'login-watch-less-files', 'login-watch-js-files']);
	gulp.task('copy-login-files', ['login-copy-js-files', 'login-copy-less-files']);

	//TASKS
	gulp.task('build-login-dev', ['build-login-js-dev', 'build-login-template-cache-dev', 'build-login-less-dev']);
	gulp.task('login-asset-precompile', ['build-login-js-production', 'build-login-template-cache-production', 
		'build-login-less-production']);
}