module.exports = function(gulp, $, options) {
	
	var runSequence = require('run-sequence'),
		ZEST_TEMPLATE_ROOT     	= '../views/zest_station/home/',
	    ZEST_HTML_FILE     		= ZEST_TEMPLATE_ROOT + 'index.html';

	require('./zest/zest_js_gulp')(gulp, $, options);
	require('./zest/zest_template_gulp')(gulp, $, options);
	require('./zest/zest_css_gulp')(gulp, $, options);
	require('./zest/zest_translation_files_gulp')(gulp, $, options);
	
	gulp.task('zest-inject-assets-to-templates', function(callback){
		return runSequence('inject-zest-js-production-to-template', 
		'inject-zest-template-cache-production-to-template', 
		'inject-zest-less-production-to-template', callback)
	});

	gulp.task('copy-zest-base-html', function(){
		return gulp.src(ZEST_HTML_FILE)
			.pipe(gulp.dest(options['DEST_ROOT_PATH']+'zest'));
	});

	gulp.task('zest-asset-prod-precompile', ['compile-zest-js-production', 'zest-template-cache-production',
	 'zest-less-production', 'concat-translation-en-zest-files-dev']);

	gulp.task('watch-zest-files', ['zest-watch-js-files', 'zest-watch-templates-files', 
		'zest-watch-translation-files', 'zest-watch-less-files']);

	 gulp.task('copy-zest-files', ['zest-copy-js-files', 'zest-copy-less-files'])
	// //TASKS
	 gulp.task('build-zest-dev', ['build-zest-less-js-dev', 'build-zest-template-cache-dev', 
		'copy-transaltion-files-for-zeststation', 'zest-generate-mapping-list-dev']);
}