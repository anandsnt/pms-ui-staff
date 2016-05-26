module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH 	= options['DEST_ROOT_PATH'],
		TRNSLTN_FILES 	= ['zest_station/zsLocales/**/*.json'];

	gulp.task('copy-transaltion-files-for-zeststation', function(){
		return gulp.src(TRNSLTN_FILES, {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('zest-watch-translation-files', function(){
		return gulp.watch(TRNSLTN_FILES, ['copy-transaltion-files-for-zeststation']);
	});
}