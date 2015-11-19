module.exports = function(gulp, $, options) {
	
	var del = require('del'),
		DEST_ROOT_PATH = '../../public/assets/';
	
	gulp.task('clean', function () {
	    del([DEST_ROOT_PATH], {force: true });
	});

	gulp.task('copy-all-dev', ['clean'], function() {
	    return gulp.src(['**/*.*', '!node_modules/**/*.*', '!package.json'])
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-dev', ['build-login-dev']);
	gulp.task('asset-precompile', ['login-asset-precompile']);
}