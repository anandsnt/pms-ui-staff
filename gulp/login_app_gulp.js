module.exports = function(gulp, $, options) {

	var runSequence 		= require('run-sequence'),
		LOGIN_TEMPLATE_ROOT	= '../views/login/',
	    LOGIN_HTML_FILE     = LOGIN_TEMPLATE_ROOT + 'new.html',
	    extend 				= require('util')._extend,
	    options 			= extend({
	    	'LOGIN_TEMPLATE_ROOT'	: LOGIN_TEMPLATE_ROOT,
	    	'LOGIN_HTML_FILE' 		: LOGIN_HTML_FILE
	    }, options);

	require('./login/login_js_gulp')(gulp, $, options);
	require('./login/login_css_gulp')(gulp, $, options);
	require('./login/login_template_gulp')(gulp, $, options);

	gulp.task('watch-login-files', ['login-watch-partials', 'login-watch-less-files', 'login-watch-js-files']);
	gulp.task('copy-login-files', ['login-copy-js-files', 'login-copy-less-files']);

	//TASKS
	gulp.task('build-login-dev', ['build-login-template-cache-dev', 'build-login-less-js-dev']);
	

	gulp.task('copy-login-base-html', function(){
		return gulp.src(LOGIN_HTML_FILE)
			.pipe(gulp.dest(options['DEST_ROOT_PATH']+'login'));
	});

	gulp.task('login-inject-assets-to-templates', function(callback){
		return runSequence('inject-login-js-production-to-template', 
		'inject-login-template-cache-production-to-template', 
		'inject-login-less-production-to-template', callback);
	});

	gulp.task('login-asset-prod-precompile', ['compile-login-js-production', 'login-template-cache-production',
	 'login-less-production']); 	
}