module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    GUESTWEB_TEMPLATES_FILE = 'guest_web_templates.js',
		GUESTWEB_TEMPLATE_ROOT  = '../views/layouts/',
	    GUESTWEB_HTML_FILE     	= GUESTWEB_TEMPLATE_ROOT + 'guestweb.html',
	    GUESTWEB_PARTIALS 		= ['**/partials/**/*.html'],
	    GUESTWEB_TEMPLTE_MANFEST_FILE = "guest_web_template_manifest.json",
	    onError = options.onError;

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(GUESTWEB_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log(filepath);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(GUESTWEB_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('build-guestweb-template-cache-production', ['guestweb-template-cache-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + GUESTWEB_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[GUESTWEB_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('guestweb-template-cache-production', function () {
	  return gulp.src(GUESTWEB_PARTIALS, {cwd:'guestweb/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(GUESTWEB_TEMPLATES_FILE, {
	            module: 'sntGuestWeb',
	            root: URL_APPENDER
	        }).on('error', onError))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}).on('error', onError))
			.pipe($.rev().on('error', onError))
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(GUESTWEB_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-guestweb-template-cache-dev', ['guestweb-template-cache-dev'], function(){
	    return templateInjector(GUESTWEB_TEMPLATES_FILE);
	});

	gulp.task('guestweb-template-cache-dev', function () {
	  return gulp.src(GUESTWEB_PARTIALS, {cwd:'guestweb/'})
	        .pipe($.templateCache(GUESTWEB_TEMPLATES_FILE, {
	            module: 'sntGuestWeb',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	//LESS END
	gulp.task('guestweb-watch-partials', function(){
		gulp.watch(GUESTWEB_PARTIALS, ['build-guestweb-template-cache-dev']);
	});

}