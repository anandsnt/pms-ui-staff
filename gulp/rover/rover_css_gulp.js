module.exports = function(gulp, $, options) {
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ROVER_CSS_FILE  		= 'rover.css',
	    ROVER_TEMPLATE_ROOT     = options['ROVER_TEMPLATE_ROOT'],
	    ROVER_HTML_FILE     	= options['ROVER_HTML_FILE'],
	    ROVER_CSS_MANIFEST_FILE = "rover_css_manifest.json",
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
	    LESS_SOURCE_FILE 		= 'stylesheets/rover.css',
	    runSequence 			= require('run-sequence'),
    	cleancss 				= new LessPluginCleanCSS({ advanced: true }),
		onError  				= options.onError;

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ROVER_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Rover injecting css file (' + (fileName) + ") to "  + ROVER_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('inject-rover-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + ROVER_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[ROVER_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('rover-less-production', ['rover-copy-less-files'], function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
	        	compress: true,
	        	plugins: [cleancss]
	        }))
	        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: true}).on('error', onError))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ROVER_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR))
	        .pipe(gulp.dest(DEST_ROOT_PATH + '/manifest/'));
	});

	gulp.task('rover-less-dev', ['rover-copy-less-files'], function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
				plugins: [cleancss]
			}))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-rover-less-dev', ['rover-less-dev'], function(){
	    return cssInjector(ROVER_CSS_FILE);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-rover-less-js-dev', ['rover-less-dev', 'build-rover-js-dev'], function(){
	    return cssInjector(ROVER_CSS_FILE);
	});
	//LESS END
	//
	
	gulp.task('rover-watch-less-files', function(){
		var paths = [LESS_SOURCE_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'rover/css/**/*.*']);
		gulp.watch(paths, function(callback){
			return runSequence('build-rover-less-dev', 'copy-rover-base-html');
		});	
	});

	gulp.task('rover-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'rover/css/**/*.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});
}
