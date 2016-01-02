module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		LOGIN_CSS_FILE  		= 'login.css',
	    LOGIN_CSS_MANIFEST_FILE = "login_css_manifest.json",
		LOGIN_TEMPLATE_ROOT     = '../views/login/',
	    LOGIN_LESS_FILE 		= 'stylesheets/login.css',
	    LOGIN_HTML_FILE     	= LOGIN_TEMPLATE_ROOT + 'new.html',
	    onError  				= options.onError;
	

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Login injecting css file (' + (fileName) + ") to "  + LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('inject-login-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[LOGIN_CSS_FILE];
	    return cssInjector(file_name);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-login-less-js-dev', ['login-less-dev', 'build-login-js-dev'], function(){
	    return cssInjector(LOGIN_CSS_FILE);
	});
	
	gulp.task('login-less-production', function () {
	  return gulp.src(LOGIN_LESS_FILE)
	        .pipe($.less({
	        	compress: true
	        }))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('login-less-dev', ['login-copy-less-files'], function () {
	  return gulp.src(LOGIN_LESS_FILE)
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-login-less-dev', ['login-less-dev'], function(){
	    return cssInjector(LOGIN_CSS_FILE);
	});

	gulp.task('login-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('login-watch-less-files', function(){
		gulp.watch([LOGIN_LESS_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*']), ['build-login-less-dev']);
	});

}