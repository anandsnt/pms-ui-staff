module.exports = function(gulp, $, options) {
	
	var ZEST_TEMPLATE_ROOT     	= '../views/zest_station/home/',
	    ZEST_HTML_FILE     		= ZEST_TEMPLATE_ROOT + 'index.html',
	    PARTIALS_PATH_LIST 		= ['**/**/*.html'],
	    ZEST_TEMPLATES_FILE    	= 'zest_templates.js',
	    MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ZEST_TEMPLTE_MANFEST_FILE = "zest_template_manifest.json",
	    URL_APPENDER            = options['URL_APPENDER'],
	    extendedMappings 		= {},
		generated 				= "____generated",
		DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'];

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(ZEST_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Zest injecting js file (' + (fileName) + ") to "  + ZEST_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ZEST_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('inject-zest-template-cache-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + ZEST_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[ZEST_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('zest-template-cache-production', function () {
	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'zest_station/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(ZEST_TEMPLATES_FILE, {
	            module: 'sntZestStation',
	            root: URL_APPENDER
	        }))
	        .pipe($.uglify({compress:true}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ZEST_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-zest-template-cache-dev', ['zest-template-cache-dev'], function(){
	    return templateInjector(ZEST_TEMPLATES_FILE);
	});

	gulp.task('zest-template-cache-dev', function () {

	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'zest_station/'})
	        .pipe($.templateCache(ZEST_TEMPLATES_FILE, {
	            module: 'sntZestStation',
	            root: URL_APPENDER
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	gulp.task('zest-watch-templates-files', function(){
		return gulp.watch(PARTIALS_PATH_LIST, ['build-zest-template-cache-dev'])
	});
}