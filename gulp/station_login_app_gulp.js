module.exports = function(gulp, $, options) {

	var runSequence 		= require('run-sequence'),
		STATION_LOGIN_TEMPLATE_ROOT	= '../views/login/',
	    STATION_LOGIN_HTML_FILE     = STATION_LOGIN_TEMPLATE_ROOT + 'station_new.html',
	    extend 				= require('util')._extend,
	    options 			= extend({
	    	'STATION_LOGIN_TEMPLATE_ROOT'	: STATION_LOGIN_TEMPLATE_ROOT,
	    	'STATION_LOGIN_HTML_FILE' 		: STATION_LOGIN_HTML_FILE
	    }, options);

	require('./station_login/station_login_js_gulp')(gulp, $, options);
	require('./station_login/station_login_css_gulp')(gulp, $, options);
	require('./station_login/station_login_template_gulp')(gulp, $, options);

	gulp.task('watch-station-login-files', ['station-login-watch-partials', 'station-login-watch-less-files', 'station-login-watch-js-files']);
	gulp.task('copy-station-login-files', ['station-login-copy-js-files', 'station-login-copy-less-files']);

	//TASKS
	gulp.task('build-station-login-dev', function(callback){
		return runSequence(['build-station-login-template-cache-dev', 'build-station-login-less-js-dev'], 'copy-station-login-base-html', callback);
	});
	

	gulp.task('copy-station-login-base-html', function(){
		return gulp.src(STATION_LOGIN_HTML_FILE)
			.pipe(gulp.dest(options['DEST_ROOT_PATH']+'login'));
	});

	gulp.task('station-login-inject-assets-to-templates', function(callback){
		return runSequence('inject-station-login-js-production-to-template', 
		'inject-station-login-template-cache-production-to-template', 
		'inject-station-login-less-production-to-template', callback);
	});

	gulp.task('station-login-asset-prod-precompile', ['compile-station-login-js-production', 'station-login-template-cache-production',
	 'station-login-less-production']); 	
}