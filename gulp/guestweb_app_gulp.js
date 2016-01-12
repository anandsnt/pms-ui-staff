module.exports = function(gulp, $, options) {

	var runSequence = require('run-sequence');
	var GUESTWEB_TEMPLATE_ROOT  = '../views/layouts/',
	    GUESTWEB_HTML_FILE     	= GUESTWEB_TEMPLATE_ROOT + 'guestweb.html';

	require('./guestweb/guestweb_js_gulp')(gulp, $, options);
	require('./guestweb/guestweb_css_gulp')(gulp, $, options);
	require('./guestweb/guestweb_template_gulp')(gulp, $, options);

	// gulp.task('watch-guestweb-files', ['guestweb-watch-partials', 'guestweb-watch-less-files', 'guestweb-watch-js-files']);
	gulp.task('copy-guestweb-files', ['guestweb-copy-js-files', 'guestweb-copy-less-files']);

	gulp.task('copy-guestwe-base-html', function(){
		return gulp.src(GUESTWEB_HTML_FILE)
			.pipe(gulp.dest(options['DEST_ROOT_PATH']+'guestweb'));
	});
	// //TASKS
	// gulp.task('build-guestweb-dev', ['build-guestweb-js-dev', 'build-guestweb-template-cache-dev', 'build-guestweb-less-dev']);
	
	gulp.task('guestweb-inject-assets-to-templates', function(callback){
		return runSequence(['create-statemapping-and-inject-guestweb-js-production', 'create-theme-mapping-template-production', 
		'create-theme-mapping-css-production'], callback);
	});

	gulp.task('guestweb-asset-prod-precompile', ['guestweb-js-production', 'guestweb-template-theme-generate-mapping-list-prod',
	 'guestweb-css-theme-generate-mapping-list-prod', 'guestweb-copy-less-files']); 
}