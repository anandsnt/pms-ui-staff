module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_CSS_FILE  		= 'login.css',
	    GUESTWEB_CSS_MANIFEST_FILE = "login_css_manifest.json",
		GUESTWEB_TEMPLATE_ROOT     = '../views/layouts/',
	    GUESTWEB_LESS_FILE 		= 'stylesheets/guestweb/**/**.css',
	    GUESTWEB_HTML_FILE     	= GUESTWEB_TEMPLATE_ROOT + 'guestweb.html',
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
    	cleancss 				= new LessPluginCleanCSS({advanced: true }),
    	nano 					= require('gulp-cssnano'),
		onError  				= options.onError;
	

	//LESS - START
	// var cssInjector = function(fileName) {
	// 	return gulp.src(GUESTWEB_HTML_FILE)
	// 		.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	//             starttag: '<!-- inject:less:{{ext}} -->',
	//             transform: function(filepath, file, i, length) {
	//                 arguments[0] = URL_APPENDER + "/" + file.relative;
	//                 return $.inject.transform.apply($.inject.transform, arguments);
	//             }
 //       		}))
 //       		.pipe(gulp.dest(GUESTWEB_TEMPLATE_ROOT, { overwrite: true }));
	// };

	// gulp.task('build-login-less-production', ['login-less-production'], function(){
	// 	var template_manifest_json = require(MANIFEST_DIR + GUESTWEB_CSS_MANIFEST_FILE),
	//         file_name = template_manifest_json[GUESTWEB_CSS_FILE];
	//     return cssInjector(file_name);
	// });

	gulp.task('guestweb-less-production', function () {
		var glob = require('glob-all'),
			es = require('event-stream'),
			lessFileList = glob.sync(GUESTWEB_LESS_FILE),
			tasks = lessFileList.map(function(file){
				return gulp.src(file, {base: '.'})
					.pipe($.less({
			        	compress: true,
			        	plugins: [cleancss]
			        }))
			        .on('error', onError)
			        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: true}).on('error', onError))
			        //.pipe(nano({discardComments:  {removeAll: true}, safe: true, zindex: false}))
			        .pipe(gulp.dest(DEST_ROOT_PATH));
			});
			console.log(lessFileList);
	  	return es.merge(tasks);
	});

	// gulp.task('login-less-dev', ['login-copy-less-files'], function () {
	//   return gulp.src(GUESTWEB_LESS_FILE)
	//         .pipe($.less())
	//         .pipe(gulp.dest(DEST_ROOT_PATH));
	// });

	// gulp.task('build-login-less-dev', ['login-less-dev'], function(){
	//     return cssInjector(GUESTWEB_CSS_FILE);
	// });

	// gulp.task('login-copy-less-files', function(){
	// 	return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*'], {base: '.'})
	// 		.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	// });

	// gulp.task('login-watch-less-files', function(){
	// 	gulp.watch([GUESTWEB_LESS_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*']), ['build-login-less-dev']);
	// });

}