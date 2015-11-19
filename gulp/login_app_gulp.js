module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		TEMPLATE_CACHE 			= options['TEMPLATE_CACHE'],
	    LOGIN_ASSET_LIST_ROOT   = '../login/',
	    LOGIN_JS_ASSET_LIST     = require ("./asset_list/loginJsAssetList").getList(),
	    LOGIN_TEMPLATES_FILE    = 'login_templates.js',
	    LOGIN_JS_COMBINED_FILE  = 'login.js',
	    LOGIN_TEMPLATE_ROOT     = '../views/login/',
	    LOGIN_FILE              = LOGIN_TEMPLATE_ROOT + 'new.html',
	    MANIFEST_DIR 			= __dirname + "/manifests/";

	//JS - Start
	gulp.task('compile-login-js-production', ['copy-all-dev'], function(){
	    return gulp.src(LOGIN_JS_ASSET_LIST)
	        .pipe($.concat(LOGIN_JS_COMBINED_FILE))
	        .pipe($.uglify({mangle:false}))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest("login_js_manifest.json"))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-login-js-production', ['compile-login-js-production'], function(){
	    var login_js_manifest_json = require(MANIFEST_DIR + "login_js_manifest.json"),
	        js_file_name = login_js_manifest_json[LOGIN_JS_COMBINED_FILE];
	    
	    return gulp.src(LOGIN_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + js_file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-login-js-dev', ['copy-all-dev'], function(){
	    return gulp.src(LOGIN_FILE)
	        .pipe($.inject(gulp.src(LOGIN_JS_ASSET_LIST, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	//JS - END
	
	//Template - START
	gulp.task('build-login-template-cache-dev', ['login-template-cache'], function(){
	    return gulp.src(LOGIN_FILE)
	        .pipe($.inject(gulp.src([DEST_ROOT_PATH + LOGIN_TEMPLATES_FILE], {read:false}), {
	            starttag: '<!-- $.inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	//Cause: PRODUCTION
	gulp.task('build-login-template-cache-production', ['login-template-cache'], function(){
	    return gulp.src(LOGIN_FILE)
	        .pipe($.inject(gulp.src([DEST_ROOT_PATH + LOGIN_TEMPLATES_FILE], {read:false}), {
	            starttag: '<!-- $.inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('login-template-cache', function () {
	  return gulp.src(['partials/**/*.html'], {cwd:'login/'})
	        .pipe(TEMPLATE_CACHE(LOGIN_TEMPLATES_FILE, {
	            module: 'login',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END
	
	//LESS - START
	gulp.task('build-login-less', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/login.css')
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//TASKS
	gulp.task('build-login-dev', ['build-login-js-dev', 'build-login-template-cache-dev', 'build-login-less']);
	gulp.task('login-asset-precompile', ['build-login-js-production', 'build-login-template-cache', 'build-login-less'])
}