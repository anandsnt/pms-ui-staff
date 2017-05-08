module.exports = function(gulp, $, options) {
    var shell = require('gulp-shell');
    gulp.task('start-server', shell.task(["lsof -P| grep ':3000' | awk '{print $2}' | xargs kill -9", 'rails s'], {verbose: true}));
}