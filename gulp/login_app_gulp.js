module.exports = function(gulp, $, options) {

	var runSequence = require('run-sequence');

	require('./login/login_js_gulp')(gulp, $, options);
	require('./login/login_css_gulp')(gulp, $, options);
	require('./login/login_template_gulp')(gulp, $, options);

	gulp.task('watch-login-files', ['login-watch-partials', 'login-watch-less-files', 'login-watch-js-files']);
	gulp.task('copy-login-files', ['login-copy-js-files', 'login-copy-less-files']);

	//TASKS
	gulp.task('build-login-dev', ['build-login-template-cache-dev', 'build-login-less-js-dev']);
	
	gulp.task('login-inject-assets-to-templates', function(){
		return runSequence('inject-login-js-production-to-template', 
		'inject-login-template-cache-production-to-template', 
		'inject-login-less-production-to-template');
	});

	gulp.task('login-asset-prod-precompile', ['compile-login-js-production', 'login-template-cache-production',
	 'login-less-production']); 	
}