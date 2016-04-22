module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		STATION_LOGIN_JS_COMBINED_FILE  = 'stationlogin.js',
		STATION_LOGIN_TEMPLATE_ROOT     = options['STATION_LOGIN_TEMPLATE_ROOT'],
	    STATION_LOGIN_HTML_FILE     	= options['STATION_LOGIN_HTML_FILE'],
	    LOGIN_JS_MANIFEST_FILE  = "station_login_js_manifest.json",
	    onError  				= options.onError,
	    runSequence 			= require('run-sequence'),
		STATION_LOGIN_JS_LIST 			= require("../../asset_list/js/login/stationLoginJsAssetList").getList();
	
	//JS - Start
	gulp.task('compile-station-login-js-production', function(){
		var nonMinifiedFiles 	= STATION_LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= STATION_LOGIN_JS_LIST.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(STATION_LOGIN_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));
                
	    return stream(minifiedStream, nonMinifiedStream)
	        .pipe($.concat(STATION_LOGIN_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('inject-station-login-js-production-to-template', function(){
	    var js_manifest_json = require(MANIFEST_DIR + LOGIN_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[STATION_LOGIN_JS_COMBINED_FILE];
	    
	    return gulp.src(STATION_LOGIN_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Station Login injecting js file (' + (file_name) + ") to "  + STATION_LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(STATION_LOGIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-station-login-js-dev', ['station-login-copy-js-files'], function(){
		var nonMinifiedFiles 	= STATION_LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= STATION_LOGIN_JS_LIST.minifiedFiles;

	    return gulp.src(STATION_LOGIN_HTML_FILE)
	        .pipe($.inject(gulp.src(minifiedFiles.concat(nonMinifiedFiles), {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(STATION_LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('station-login-copy-js-files', function(){
		return gulp.src(STATION_LOGIN_JS_LIST.nonMinifiedFiles.concat(STATION_LOGIN_JS_LIST.minifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('station-login-watch-js-files', function(){
		var nonMinifiedFiles 	= STATION_LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= STATION_LOGIN_JS_LIST.minifiedFiles;
		gulp.watch(nonMinifiedFiles.concat(minifiedFiles), function(callback){
			return runSequence('build-station-login-js-dev', 'copy-station-login-base-html')
		});
	});

	//JS - END
}