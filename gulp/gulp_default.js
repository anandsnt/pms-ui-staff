module.exports = function(gulp, $, options) {
	
            var del = require('del'),
                    DEST_ROOT_PATH = '../../public/assets/',
                    runSequence = require('run-sequence'); //will be running from app/assets, so..
	
            gulp.task('clean', function () {
                return del([DEST_ROOT_PATH], {force: true });
            });

            gulp.task('copy-all-dev', [
                'copy-rover-files', 
                'copy-login-files', 
                'copy-station-login-files',
                'copy-zest-files', 
                'copy-zeststation-files'
            ]);

            var compilationTasks = [
                    'rover-asset-prod-precompile',  
                    'admin-asset-prod-precompile',
                    'zest-asset-prod-precompile',
                    'login-asset-prod-precompile',
                    'station-login-asset-prod-precompile',
                    'guestweb-asset-prod-precompile',
                    'guestweb-v2-asset-prod-precompile'
                ],

		tasksAfterCompilation = [
                    'rover-inject-assets-to-templates', 
                    'admin-inject-assets-to-templates', 
                    'guestweb-inject-assets-to-templates',
                    'guestweb-v2-inject-assets-to-templates', 
                    'login-inject-assets-to-templates', 
                    'station-login-inject-assets-to-templates', 
                    'zest-inject-assets-to-templates'
                ],

		copyBaseHtmlToPublicAssets = [
                    'copy-login-base-html', 
                    'copy-station-login-base-html', 
                    'copy-admin-base-html', 
                    'copy-zest-base-html',
                    'copy-rover-base-html', 
                    'copy-guestweb-base-html', 
                    'compress-images-loselessly',
                    'copy-guestweb-v2-base-html'
                ],

		developmentTasks = [
                    'build-rover-dev', 
                    'build-login-dev', 
                    'build-station-login-dev', 
                    'build-admin-dev', 
                    'build-zest-dev', 
                    'build-guestweb-dev',
                    'build-guestweb-v2-dev'
                ],

		watchTasks = [
                    'watch-rover-files', 
                    'watch-login-files',
                    'watch-station-login-files', 
                    'watch-admin-files', 
                    'watch-zest-files', 
                    'watch-guestweb-files',
                    'watch-guestweb-v2-files'
                ];

	var processArgs = function() {
		var argv  = require('yargs').argv,
			index = -1;

		//if you dont want to work with guest web (zest web),  you can pass --no-gw arg with gulp s. eg:- gulp s --no-gw
		if( 'gw' in argv &&  !argv.gw ) {

			developmentTasks.splice(developmentTasks.indexOf('build-guestweb-dev'), 1);
			developmentTasks.splice(developmentTasks.indexOf('build-guestweb-v2-dev'), 1);

			copyBaseHtmlToPublicAssets.splice(copyBaseHtmlToPublicAssets.indexOf('copy-guestweb-base-html'), 1);
			copyBaseHtmlToPublicAssets.splice(copyBaseHtmlToPublicAssets.indexOf('copy-guestweb-v2-base-html'), 1);

			watchTasks.splice(watchTasks.indexOf('watch-guestweb-files'), 1);
			watchTasks.splice(watchTasks.indexOf('watch-guestweb-v2-files'), 1);
		}

		//if you dont want to work with zest station,  you can pass --no-zs arg with gulp s. eg:- gulp s --no-zs
		if( 'zs' in argv &&  !argv.zs ) {

			developmentTasks.splice(developmentTasks.indexOf('build-zest-dev'), 1);

			copyBaseHtmlToPublicAssets.splice(copyBaseHtmlToPublicAssets.indexOf('copy-zest-base-html'), 1);

			watchTasks.splice(watchTasks.indexOf('watch-zest-files'), 1);
		}
	};

	//development
	gulp.task('build', developmentTasks, function(callback){
		return runSequence(copyBaseHtmlToPublicAssets, callback)
	});

	gulp.task('asset-precompile', function(callback){
		return runSequence(compilationTasks, tasksAfterCompilation, copyBaseHtmlToPublicAssets, callback);
	});

	gulp.task('watch', watchTasks);

	gulp.task('default', function(callback) {
		processArgs();
		return runSequence(['build', 'watch'], callback);
	});

	//starting sever & perform the default tasks
	gulp.task('s', function(callback){
		processArgs();
		return runSequence(['start-server', 'build', 'watch'], callback);
	});
}