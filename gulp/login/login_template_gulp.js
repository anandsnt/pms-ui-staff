module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    LOGIN_TEMPLATES_FILE    = 'login_templates.js',
	    LOGIN_TEMPLATE_ROOT     = '../views/login/',
	    LOGIN_HTML_FILE     	= LOGIN_TEMPLATE_ROOT + 'new.html',
	    LOGIN_PARTIALS 			= ['partials/**/*.html'],
	    LOGIN_TEMPLTE_MANFEST_FILE 	= "login_template_manifest.json",
	    onError = options.onError;

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Login injecting template file (' + (fileName) + ") to "  + LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('inject-login-template-cache-production-to-template',  function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[LOGIN_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('login-template-cache-production', function () {
	  return gulp.src(LOGIN_PARTIALS, {cwd:'login/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(LOGIN_TEMPLATES_FILE, {
	            module: 'login',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-login-template-cache-dev', ['login-template-cache-dev'], function(){
	    return templateInjector(LOGIN_TEMPLATES_FILE);
	});

	gulp.task('login-template-cache-dev', function () {
	  return gulp.src(LOGIN_PARTIALS, {cwd:'login/'})
	        .pipe($.templateCache(LOGIN_TEMPLATES_FILE, {
	            module: 'login',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	//LESS END
	gulp.task('login-watch-partials', function(){
		gulp.watch(LOGIN_PARTIALS, ['build-login-template-cache-dev']);
	});

}