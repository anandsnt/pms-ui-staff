module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_V2_CSS_FILE  		= 'guestweb_v2.css',
	    GUESTWEB_V2_CSS_MANIFEST_FILE = "guestweb_v2_css_manifest.json",
	    GUESTWEB_V2_LESS_FILE 		= 'stylesheets/guestweb_v2.css',
	    runSequence 			= require('run-sequence'),
	    GUESTWEB_V2_TEMPLATE_ROOT     = options['GUESTWEB_V2_TEMPLATE_ROOT'],
	    GUESTWEB_V2_HTML_FILE     	= options['GUESTWEB_V2_HTML_FILE'],
	    onError  				= options.onError;
	

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(GUESTWEB_V2_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:true}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return "<style type='text/css'>" + file.contents.toString('utf8') + "</style>";
	            }
       		}))
       		.pipe(gulp.dest(GUESTWEB_V2_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('inject-guestweb-v2-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + GUESTWEB_V2_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[GUESTWEB_V2_CSS_FILE];
	    return cssInjector(file_name);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-guestweb-v2-less-js-dev', ['guestweb-v2-less-dev', 'build-guestweb-v2-js-dev'], function(){
	    return cssInjector(GUESTWEB_V2_CSS_FILE);
	});
	
	gulp.task('guestweb-v2-less-production', function () {
	  return gulp.src(GUESTWEB_V2_LESS_FILE)
	        .pipe($.less({
	        	compress: true
	        }))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(GUESTWEB_V2_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('guestweb-v2-less-dev', ['guestweb-v2-copy-less-files'], function () {
	  return gulp.src(GUESTWEB_V2_LESS_FILE)
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-guestweb-v2-less-dev', ['guestweb-v2-less-dev'], function(){
	    return cssInjector(GUESTWEB_V2_CSS_FILE);
	});

	gulp.task('guestweb-v2-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'guestweb_v2/css/*.less', 'type/**/**.*','guestweb_v2/images/**/*.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('guestweb-v2-watch-less-files', function(){
		return gulp.watch([GUESTWEB_V2_LESS_FILE].concat(['stylesheets/**/*.*','guestweb_v2/css/**/*.less', 'type/**/**.*']), function(callback){
			return runSequence('build-guestweb-v2-less-dev', 'copy-guestweb-v2-base-html')
		});
	});

}