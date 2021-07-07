module.exports = function(gulp, $, options) {
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			=  __dirname + "/manifests/",
	    MOBILE_CSS_FILE  		= 'rover_mobile.css',
	    ROVER_TEMPLATE_ROOT     = options['ROVER_TEMPLATE_ROOT'],
	    ROVER_HTML_FILE     	= options['ROVER_HTML_FILE'],
	    MOBILE_CSS_MANIFEST_FILE = "mobile_css_manifest.json",
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
		LESS_SOURCE_FILE 		= 'stylesheets/rover_mobile.css',
	    runSequence 			= require('run-sequence'),
    	cleancss 				= new LessPluginCleanCSS({ advanced: true }),
		onError  				= options.onError;

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ROVER_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:mobile-less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Rover injecting css file (' + (fileName) + ") to "  + ROVER_HTML_FILE);
	                return "<link rel='stylesheet' href='" + URL_APPENDER + "/" + file.relative + "' media='screen and (max-width: 767px)'>";
	            }
			}))
       		.pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	};

	// Task for injecing(prod) mobile.css into rover.html
	gulp.task('inject-mobile-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + MOBILE_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[MOBILE_CSS_FILE];
	    return cssInjector(file_name);
	});

	// Task for compiling(prod) mobile.css.less
	gulp.task('mobile-less-production', function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
	        	compress: true,
	        	plugins: [cleancss]
	        }))
            .on('error', onError)
	        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: true}).on('error', onError))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(MOBILE_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR))
	        .pipe(gulp.dest(DEST_ROOT_PATH + '/manifests/'));
	});

	// Task for compiling(dev) mobile.css.less and rename the result to mobile.css
	// rename used here to rename mobile.css.css to mobile.css
	gulp.task('mobile-less-dev', function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
				plugins: [cleancss]
			}))
			.pipe(gulp.dest(DEST_ROOT_PATH));
	});

	// Task for watching mobile less files
	gulp.task('rover-mobile-watch-less-files', function(){
		var paths = [LESS_SOURCE_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'rover/css/**/*.*']);
		gulp.watch(paths, function(callback){
			return runSequence('build-mobile-less-dev', 'copy-rover-base-html');
		});
	});

	// Task for Injecting(dev) mobile.css into rover.html
	gulp.task('build-mobile-less-dev', ['mobile-less-dev'], function(){
	    return cssInjector(MOBILE_CSS_FILE);
	});
}
