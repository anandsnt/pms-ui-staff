module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    LOGIN_ASSET_LIST_ROOT   = '../login/',
	    LOGIN_JS_ASSET_LIST     = require ("./asset_list/loginJsAssetList").getList(),
	    LOGIN_TEMPLATES_FILE    = 'login_templates.js',
	    LOGIN_JS_COMBINED_FILE  = 'login.js',
	    LOGIN_CSS_FILE  		= 'login.css',
	    LOGIN_TEMPLATE_ROOT     = '../views/login/',
	    LOGIN_HTML_FILE     	= LOGIN_TEMPLATE_ROOT + 'new.html',
	    LOGIN_JS_MANIFEST_FILE  = "login_js_manifest.json",
	    LOGIN_CSS_MANIFEST_FILE = "login_css_manifest.json",
	    LOGIN_TEMPLTE_MANFEST_FILE 	= "login_template_manifest.json";

	//JS - Start
	gulp.task('compile-login-js-production', ['copy-all-dev'], function(){
	    return gulp.src(LOGIN_JS_ASSET_LIST)
	        .pipe($.concat(LOGIN_JS_COMBINED_FILE))
	        .pipe($.ngAnnotate({single_quotes: true}))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('build-login-js-production', ['compile-login-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + LOGIN_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[LOGIN_JS_COMBINED_FILE];
	    
	    return gulp.src(LOGIN_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-login-js-dev', ['copy-all-dev'], function(){
	    return gulp.src(LOGIN_HTML_FILE)
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
	var templateInjector = function(fileName) {
		return gulp.src(LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('build-login-template-cache-production', ['login-template-cache-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[LOGIN_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('login-template-cache-production', function () {
	  return gulp.src(['partials/**/*.html'], {cwd:'login/'})
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
	  return gulp.src(['partials/**/*.html'], {cwd:'login/'})
	        .pipe($.templateCache(LOGIN_TEMPLATES_FILE, {
	            module: 'login',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END
	
	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('build-login-less-production', ['login-less-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[LOGIN_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('login-less-production', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/login.css')
	        .pipe($.less({
	        	compress: true
	        }))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('login-less-dev', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/login.css')
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-login-less-dev', ['login-less-dev'], function(){
	    return cssInjector(LOGIN_CSS_FILE);
	});

	//LESS END
	
	//TASKS
	gulp.task('build-login-dev', ['build-login-js-dev', 'build-login-template-cache-dev', 'build-login-less-dev']);
	gulp.task('login-asset-precompile', ['build-login-js-production', 'build-login-template-cache-production', 'build-login-less-production'])
}