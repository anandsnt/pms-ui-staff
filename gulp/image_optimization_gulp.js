module.exports = function(gulp, $, options) {

	var imagemin = require('gulp-imagemin');
	var pngquant = require('imagemin-pngquant');


	gulp.task('compress-images-loselessly', function(){
		return gulp.src(['images/*', 'cssimg/*'], {base: '.'})
			.pipe(imagemin({
				optimizationLevel: 7,
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest(options['DEST_ROOT_PATH'], { overwrite: true }));		
	});
}