module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH 	= options['DEST_ROOT_PATH'],
		TRNSLTN_FILES 	= ['admin/adLocales/en/*.json'];

	gulp.task('concat-translation-en-admin-files-dev', function(){
		return gulp.src(['admin/adLocales/en/*.json'])
			.pipe($.translationConcat(DEST_ROOT_PATH + 'adLocales/EN.json', {sep: ',', process: function(src){
				return (src.trim().replace(/\n/g, ''));
			}}))
			.pipe($.translationConcat.header('{'))
			.pipe($.translationConcat.footer('}'))
			.pipe($.jsonminify())
			.pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('admin-watch-translation-files', function(){
		gulp.watch(TRNSLTN_FILES, ['concat-translation-en-admin-files-dev']);
	});
}