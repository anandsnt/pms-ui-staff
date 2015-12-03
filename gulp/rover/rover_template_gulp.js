module.exports = function(gulp, $, options) {
	
	var ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
	    ROVER_HTML_FILE     	= ROVER_TEMPLATE_ROOT + 'rover.html',
	    PARTIALS_PATH_LIST 		= ['**/*.html'],
	    ROVER_TEMPLATES_FILE    = 'rover_templates.js',
	    MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ROVER_TEMPLTE_MANFEST_FILE = "rover_template_manifest.json",
	    URL_APPENDER            = options['URL_APPENDER'],
		DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'];

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(ROVER_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('build-rover-template-cache-production', ['rover-template-cache-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ROVER_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[ROVER_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('rover-template-cache-production', function () {
	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'rover/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(ROVER_TEMPLATES_FILE, {
	            module: 'sntRover',
	            root: URL_APPENDER
	        }))
	        .pipe($.uglify({compress:true}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ROVER_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-rover-template-cache-dev', ['rover-template-cache-dev'], function(){
	    return templateInjector(ROVER_TEMPLATES_FILE);
	});

	gulp.task('rover-template-cache-dev', ['copy-all-dev'], function () {

	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'rover/'})
	        .pipe($.templateCache(ROVER_TEMPLATES_FILE, {
	            module: 'sntRover',
	            root: URL_APPENDER
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	gulp.task('rover-watch-templates-files', function(){
		gulp.watch(PARTIALS_PATH_LIST, ['build-rover-template-cache-dev'])
	});
}