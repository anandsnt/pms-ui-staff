module.exports = function(gulp, $, options) {

    var imagemin = require('gulp-imagemin');
    var pngquant = require('imagemin-pngquant');


    gulp.task('compress-images-loselessly', function(){
        return gulp.src(['images/*', 'cssimg/*', 'guestweb/common_images/*', 'guestweb/img/*'], {base: '.'})
            .pipe(imagemin({
                optimizationLevel: 1,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(options['DEST_ROOT_PATH'], { overwrite: true }));        
    });
}