module.exports = function(gulp, $, options) {
	
	var del = require('del'),
		DEST_ROOT_PATH = '../../public/assets/',
		allPaths = ['**/*.*', '!node_modules/**/*.*', 
		'!bower.json', '!Gruntfile.js', '!gulpfile.js',
		'!package.json', '!gulp/**/*.*']; //will be running from app/assets, so..
	
	gulp.task('clean', function () {
	    del([DEST_ROOT_PATH], {force: true });
	});

	gulp.task('copy-all-prod', ['clean'], function() {
	    return gulp.src(allPaths)
	        .pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('copy-all-dev', function() {
	    return gulp.src(allPaths)
	        .pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	//development
	gulp.task('build', ['build-rover-dev', 'build-admin-dev', 'build-login-dev']);

	//produciton
	gulp.task('asset-precompile', ['rover-asset-precompile', 'admin-asset-precompile', 'login-asset-precompile']);

	gulp.task('watch', ['watch-rover-files']);

	gulp.task('default', ['build', 'start-server', 'watch']);
}