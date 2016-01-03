module.exports = function(gulp, $, options) {

	var runSequence = require('run-sequence');

	require('./guestweb/guestweb_js_gulp')(gulp, $, options);
	require('./guestweb/guestweb_css_gulp')(gulp, $, options);
	require('./guestweb/guestweb_template_gulp')(gulp, $, options);

	// gulp.task('watch-guestweb-files', ['guestweb-watch-partials', 'guestweb-watch-less-files', 'guestweb-watch-js-files']);
	gulp.task('copy-guestweb-files', ['guestweb-copy-js-files', 'guestweb-copy-less-files']);

	// //TASKS
	// gulp.task('build-guestweb-dev', ['build-guestweb-js-dev', 'build-guestweb-template-cache-dev', 'build-guestweb-less-dev']);
	
	gulp.task('guestweb-inject-assets-to-templates', function(){
		return runSequence(['create-statemapping-and-inject-guestweb-js-production', 'create-theme-mapping-template-production', 
		'create-theme-mapping-css-production']);
	});

	gulp.task('guestweb-asset-prod-precompile', ['guestweb-js-production', 'guestweb-template-theme-generate-mapping-list-prod',
	 'guestweb-css-theme-generate-mapping-list-prod', 'guestweb-copy-less-files']); 
}