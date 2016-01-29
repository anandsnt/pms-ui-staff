module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    GUESTWEB_V2_TEMPLATES_FILE    = 'guestweb_v2_templates.js',
	    GUESTWEB_V2_TEMPLATE_ROOT     = options['GUESTWEB_V2_TEMPLATE_ROOT'],
	    GUESTWEB_V2_HTML_FILE     	= options['GUESTWEB_V2_HTML_FILE'],
	    GUESTWEB_V2_PARTIALS 			= ['guestweb_v2/**/partials/**/*.html'],
	    runSequence 			= require('run-sequence'),
	    GUESTWEB_V2_TEMPLTE_MANFEST_FILE 	= "guestweb_v2_template_manifest.json",
	    onError = options.onError;

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(GUESTWEB_V2_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Guestweb2 injecting template file (' + (fileName) + ") to "  + GUESTWEB_V2_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(GUESTWEB_V2_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('inject-guestweb-v2-template-cache-production-to-template',  function(){
		var template_manifest_json = require(MANIFEST_DIR + GUESTWEB_V2_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[GUESTWEB_V2_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('guestweb-v2-template-cache-production', function () {
	  return gulp.src(GUESTWEB_V2_PARTIALS, {cwd:'guestweb_v2/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(GUESTWEB_V2_TEMPLATES_FILE, {
	            module: 'guestweb_v2',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(GUESTWEB_V2_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-guestweb-v2-template-cache-dev', ['guestweb-v2-template-cache-dev'], function(){
	    return templateInjector(GUESTWEB_V2_TEMPLATES_FILE);
	});

	gulp.task('guestweb-v2-template-cache-dev', function () {
		console.log(DEST_ROOT_PATH + "0----"+GUESTWEB_V2_PARTIALS+"-----------"+GUESTWEB_V2_TEMPLATES_FILE)
	  return gulp.src(GUESTWEB_V2_PARTIALS, {cwd:'guestweb_v2/'})
	        .pipe($.templateCache(GUESTWEB_V2_TEMPLATES_FILE, {
	            module: 'guestweb_v2',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	//LESS END
	gulp.task('guestweb-v2-watch-partials', function(){
		return gulp.watch(GUESTWEB_V2_PARTIALS, function(callback){
			return runSequence('build-guestweb-v2-template-cache-dev', 'copy-guestweb-v2-base-html')
		});
	});

}