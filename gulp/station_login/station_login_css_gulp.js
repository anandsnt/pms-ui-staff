module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		LOGIN_CSS_FILE  		= 'stationlogin.css',
	    LOGIN_CSS_MANIFEST_FILE = "station_login_css_manifest.json",
	    LOGIN_LESS_FILE 		= 'stylesheets/stationlogin.css',
	    runSequence 			= require('run-sequence'),
	    STATION_LOGIN_TEMPLATE_ROOT     = options['STATION_LOGIN_TEMPLATE_ROOT'],
	    STATION_LOGIN_HTML_FILE     	= options['STATION_LOGIN_HTML_FILE'],
	    onError  				= options.onError;
	

	//LESS - START
	var cssInjector = function(fileName) {
            console.log('css injecting---- to:  ',STATION_LOGIN_HTML_FILE)
		return gulp.src(STATION_LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:true}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Station Login injecting css file (' + (fileName) + ") to "  + STATION_LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return "<style type='text/css'>" + file.contents.toString('utf8') + "</style>";
	            }
       		}))
       		.pipe(gulp.dest(STATION_LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('inject-station-login-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[LOGIN_CSS_FILE];
	    return cssInjector(file_name);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-station-login-less-js-dev', ['station-login-less-dev', 'build-station-login-js-dev'], function(){
	    return cssInjector(LOGIN_CSS_FILE);
	});
	
	gulp.task('station-login-less-production', function () {
	  return gulp.src(LOGIN_LESS_FILE)
	        .pipe($.less({
	        	compress: true
	        }))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('station-login-less-dev', ['station-login-copy-less-files'], function () {
	  return gulp.src(LOGIN_LESS_FILE)
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-station-login-less-dev', ['station-login-less-dev'], function(){
	    return cssInjector(LOGIN_CSS_FILE);
	});

	gulp.task('station-login-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('station-login-watch-less-files', function(){
		return gulp.watch([LOGIN_LESS_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*']), function(callback){
			return runSequence('build-station-login-less-dev', 'copy-station-login-base-html')
		});
	});

}