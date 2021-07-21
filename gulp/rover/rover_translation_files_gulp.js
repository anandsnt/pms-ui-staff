module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH 	= options['DEST_ROOT_PATH'],
		TRNSLTN_FILES 	= ['rover/rvLocales/en/*.json'];

	gulp.task('concat-translation-en-rover-files-dev', function(){
		return gulp.src(TRNSLTN_FILES)
			.pipe($.translationConcat('rvLocales/EN.json', {sep: ',', process: function(src){
				return (src.trim().replace(/\n/g, ''));
			}}))
			.pipe($.translationConcat.header('{'))
			.pipe($.translationConcat.footer('}'))
			.pipe($.jsonminify())
			.pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('rover-watch-translation-files', function(){
		gulp.watch(TRNSLTN_FILES, ['concat-translation-en-rover-files-dev']);
	});
}