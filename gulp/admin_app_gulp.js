module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    ADMIN_ASSET_LIST_ROOT   = '../admin/',
	    ADMIN_JS_ASSET_LIST     = require ("./asset_list/adminJsAssetList").getList(),
	    ADMIN_TEMPLATES_FILE    = 'admin_templates.js',
	    ADMIN_JS_COMBINED_FILE  = 'admin.js',
	    ADMIN_CSS_FILE  		= 'admin.css',
	    ADMIN_TEMPLATE_ROOT     = '../views/admin/settings/',
	    ADMIN_HTML_FILE     	= ADMIN_TEMPLATE_ROOT + 'settings.html',
	    ADMIN_JS_MANIFEST_FILE  = "admin_js_manifest.json",
	    ADMIN_CSS_MANIFEST_FILE = "admin_css_manifest.json",
	    ADMIN_TEMPLTE_MANFEST_FILE 	= "admin_template_manifest.json";

	//JS - Start
	gulp.task('compile-admin-js-production', ['copy-all-dev'], function(){
	    return gulp.src(ADMIN_JS_ASSET_LIST)
	        .pipe($.concat(ADMIN_JS_COMBINED_FILE))
	        .pipe($.ngAnnotate({single_quotes: true}))
	        .pipe($.uglify({compress:true}))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ADMIN_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('build-admin-js-production', ['compile-admin-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + ADMIN_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[ADMIN_JS_COMBINED_FILE];
	    
	    return gulp.src(ADMIN_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-admin-js-dev', ['copy-all-dev'], function(){
	    return gulp.src(ADMIN_HTML_FILE)
	        .pipe($.inject(gulp.src(ADMIN_JS_ASSET_LIST, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	//JS - END
	
	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(ADMIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('build-admin-template-cache-production', ['admin-template-cache-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ADMIN_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[ADMIN_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('admin-template-cache-production', ['copy-all-dev'], function () {
	  return gulp.src(['partials/**/*.html'], {cwd:'admin/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(ADMIN_TEMPLATES_FILE, {
	            module: 'admin',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe($.uglify({compress:true}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ADMIN_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-admin-template-cache-dev', ['admin-template-cache-dev'], function(){
	    return templateInjector(ADMIN_TEMPLATES_FILE);
	});

	gulp.task('admin-template-cache-dev', ['copy-all-dev'], function () {
	  return gulp.src(['partials/**/*.html'], {cwd:'admin/'})
	        .pipe($.templateCache(ADMIN_TEMPLATES_FILE, {
	            module: 'admin',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END
	
	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ADMIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('build-admin-less-production', ['admin-less-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ADMIN_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[ADMIN_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('admin-less-production', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/admin.css')
	        .pipe($.less({
	        	compress: true
	        }))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ADMIN_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('admin-less-dev', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/admin.css')
	        .pipe($.less())
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-admin-less-dev', ['admin-less-dev'], function(){
	    return cssInjector(ADMIN_CSS_FILE);
	});

	//LESS END
	
	//TASKS
	gulp.task('build-admin-dev', ['build-admin-js-dev', 'build-admin-template-cache-dev']); //, 'build-admin-less-dev'
	gulp.task('admin-asset-precompile', ['build-admin-js-production', 'build-admin-template-cache-production']); //, 'build-admin-less-production'
}