module.exports = function (gulp, $, options) {
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    ADMIN_ASSET_LIST_ROOT   = '../admin/',
	    ADMIN_TEMPLATES_FILE    = 'admin_templates.js',
		ADMIN_TEMPLATE_ROOT     = options['ADMIN_TEMPLATE_ROOT'],
	    ADMIN_HTML_FILE     	= options['ADMIN_HTML_FILE'],
	    PARTIALS_PATH_LIST 		= ['admin/**/*.html', 'shared/sntUtils/**/*.html'],
	    runSequence 			= require('run-sequence'),
	    ADMIN_TEMPLTE_MANFEST_FILE 	= "admin_template_manifest.json",
		onError  				= options.onError;

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(ADMIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Admin injecting template file (' + (fileName) + ") to "  + ADMIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }))
       		.on("error", onError);
	};

	//Be careful: PRODUCTION
	gulp.task('inject-admin-template-cache-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + ADMIN_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[ADMIN_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('admin-template-cache-production', function () {
	  	return gulp.src(PARTIALS_PATH_LIST)
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare: true,
    			empty: true
	  		}))
	        .pipe($.templateCache(ADMIN_TEMPLATES_FILE, {
	            module: 'admin',
	            root: URL_APPENDER
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

	gulp.task('admin-template-cache-dev', function () {
	  return gulp.src(PARTIALS_PATH_LIST)
	        .pipe($.templateCache(ADMIN_TEMPLATES_FILE, {
	            module: 'admin',
	            root: URL_APPENDER 
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('admin-watch-templates-files', function(){
		return gulp.watch(PARTIALS_PATH_LIST, function(callback){
			return runSequence('build-admin-template-cache-dev', 'copy-admin-base-html');
		});
	});
}
