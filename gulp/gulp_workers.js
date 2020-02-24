module.exports = function(gulp, $, options) {
    const source = ['shared/**/workers/**/*.js'];

    let copyWorkers = function() {
        return gulp.src(source, {
            base: '.'
        }).
        pipe(gulp.dest(options['DEST_ROOT_PATH'], {overwrite: true}));
    };

    let watchWorkers = function() {
        return gulp.watch(source, ['copy-workers']);
    };

    gulp.task('copy-workers', copyWorkers);
    gulp.task('watch-workers', ['copy-workers'], watchWorkers);
};
