module.exports = function(gulp, $, options) {
	
	var del = require('del'),
		DEST_ROOT_PATH = '../../public/assets/',
		allPaths = ['**/*.*', '!node_modules/**/*.*', '!package.json'];
	
	gulp.task('clean', function () {
	    del([DEST_ROOT_PATH], {force: true });
	});

	gulp.task('copy-all-dev', ['clean'], function() {
	    return gulp.src(allPaths)
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-dev', ['build-login-dev']);
	gulp.task('asset-precompile', ['login-asset-precompile']);

	gulp.task('watch', function(){
		gulp.watch(allPaths, ['build-dev'])
	});

	gulp.task('default', ['build-dev', 'watch'])
}