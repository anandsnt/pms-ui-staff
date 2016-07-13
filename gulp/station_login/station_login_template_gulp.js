module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    STATION_LOGIN_TEMPLATES_FILE    = 'stationlogin_templates.js',
	    STATION_LOGIN_TEMPLATE_ROOT     = options['STATION_LOGIN_TEMPLATE_ROOT'],
	    STATION_LOGIN_HTML_FILE     	= options['STATION_LOGIN_HTML_FILE'],
	    LOGIN_PARTIALS 			= ['partials/**/*.html'],
	    runSequence 			= require('run-sequence'),
	    LOGIN_TEMPLTE_MANFEST_FILE 	= "station_login_template_manifest.json",
	    onError = options.onError;

	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(STATION_LOGIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Station Login injecting template file (' + (fileName) + ") to "  + STATION_LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(STATION_LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('inject-station-login-template-cache-production-to-template',  function(){
		var template_manifest_json = require(MANIFEST_DIR + LOGIN_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[STATION_LOGIN_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('station-login-template-cache-production', function () {
	  return gulp.src(LOGIN_PARTIALS, {cwd:'login/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(STATION_LOGIN_TEMPLATES_FILE, {
	            module: 'login',//angular module
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

	gulp.task('build-station-login-template-cache-dev', ['login-station-login-template-cache-dev'], function(){
	    return templateInjector(STATION_LOGIN_TEMPLATES_FILE);
	});

	gulp.task('login-station-login-template-cache-dev', function () {
	  return gulp.src(LOGIN_PARTIALS, {cwd:'login/'})
	        .pipe($.templateCache(STATION_LOGIN_TEMPLATES_FILE, {
	            module: 'login',
	            root: URL_APPENDER + "/partials/"
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END

	//LESS END
	gulp.task('station-login-watch-partials', function(){
		return gulp.watch(LOGIN_PARTIALS, function(callback){
			return runSequence('build-station-login-template-cache-dev', 'copy-station-login-base-html')
		});
	});

}