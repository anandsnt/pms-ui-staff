module.exports = function(gulp, $, options) {
	var shell = require('gulp-shell');
	gulp.task('start-server', shell.task(['rails s'], {verbose: true}));
}