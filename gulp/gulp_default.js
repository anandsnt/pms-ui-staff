module.exports = function(gulp, $, options) {
	
	var del = require('del'),
		DEST_ROOT_PATH = '../../public/assets/'; //will be running from app/assets, so..
	
	gulp.task('clean', function () {
	    return del([DEST_ROOT_PATH], {force: true });
	});

	gulp.task('copy-all-dev', ['copy-rover-files', 'copy-login-files', 'copy-zest-files']);

	//development
	gulp.task('build', ['build-rover-dev', 'build-login-dev', 'build-admin-dev', 'build-zest-dev']);

	//produciton
	gulp.task('asset-precompile', ['rover-asset-precompile', 'admin-asset-precompile', 'login-asset-precompile',
		'zest-asset-precompile']);

	gulp.task('watch', ['watch-rover-files', 'watch-login-files', 'watch-admin-files']);

	gulp.task('default', ['build', 'watch']);

	//starting sever & perform the default tasks
	gulp.task('s', ['build', 'watch', 'start-server']);
}