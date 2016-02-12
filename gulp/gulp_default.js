module.exports = function(gulp, $, options) {
	
	var del = require('del'),
		DEST_ROOT_PATH = '../../public/assets/',
		runSequence = require('run-sequence'); //will be running from app/assets, so..
	
	gulp.task('clean', function () {
	    return del([DEST_ROOT_PATH], {force: true });
	});

	gulp.task('copy-all-dev', ['copy-rover-files', 'copy-login-files', 'copy-zest-files', 'copy-zeststation-files']);

	//development
	gulp.task('build', ['build-rover-dev', 'build-login-dev', 'build-admin-dev', 'build-zest-dev', 'build-guestweb-dev','build-guestweb-v2-dev'], function(callback){
		return runSequence(copyBaseHtmlToPublicAssets, callback)
	});
	
	var compilationTasks = ['rover-asset-prod-precompile',  'admin-asset-prod-precompile',
		 'zest-asset-prod-precompile', 'login-asset-prod-precompile', 'guestweb-asset-prod-precompile','guestweb-v2-asset-prod-precompile'],

		tasksAfterCompilation = ['rover-inject-assets-to-templates', 'admin-inject-assets-to-templates', 
		 'guestweb-inject-assets-to-templates','guestweb-v2-inject-assets-to-templates', 'login-inject-assets-to-templates', 'zest-inject-assets-to-templates'],

		copyBaseHtmlToPublicAssets = ['copy-login-base-html', 'copy-admin-base-html', 'copy-zest-base-html',
			'copy-rover-base-html', 'copy-guestweb-base-html', 'compress-images-loselessly','copy-guestweb-v2-base-html'];

	gulp.task('asset-precompile', function(callback){
		return runSequence(compilationTasks, tasksAfterCompilation, copyBaseHtmlToPublicAssets, callback);
	});

	gulp.task('watch', ['watch-rover-files', 'watch-login-files', 'watch-admin-files', 'watch-zest-files', 'watch-guestweb-files','watch-guestweb-v2-files']);

	gulp.task('default', ['build', 'watch']);

	//starting sever & perform the default tasks
	gulp.task('s', ['default', 'start-server']);
}