module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_JS_COMBINED_FILE  = 'guest_web.js',
		GUESTWEB_TEMPLATE_ROOT     = '../views/layouts/',
	    GUESTWEB_HTML_FILE     	= GUESTWEB_TEMPLATE_ROOT + 'guestweb.html',
	    GUESTWEB_JS_MANIFEST_FILE  = "guestweb_js_manifest.json",
	    onError  				= options.onError,
		GUESTWEB_JS_LIST 		= require("../../asset_list/js/guestwebAssetList").getList();
	
	//JS - Start
	gulp.task('compile-guestweb-js-production', function(){
		var nonMinifiedFiles 	= GUESTWEB_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_JS_LIST.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(GUESTWEB_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));

	    return stream(minifiedStream, nonMinifiedStream)
	        .pipe($.concat(GUESTWEB_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(GUESTWEB_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('build-guestweb-js-production', ['compile-guestweb-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + GUESTWEB_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[GUESTWEB_JS_COMBINED_FILE];
	    
	    return gulp.src(GUESTWEB_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(GUESTWEB_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-login-js-dev', ['login-copy-js-files'], function(){
		var nonMinifiedFiles 	= GUESTWEB_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_JS_LIST.minifiedFiles;

	    return gulp.src(GUESTWEB_HTML_FILE)
	        .pipe($.inject(gulp.src(minifiedFiles.concat(nonMinifiedFiles), {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(GUESTWEB_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('login-copy-js-files', function(){
		return gulp.src(GUESTWEB_JS_LIST.nonMinifiedFiles.concat(GUESTWEB_JS_LIST.minifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('login-watch-js-files', function(){
		var nonMinifiedFiles 	= GUESTWEB_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_JS_LIST.minifiedFiles;
		gulp.watch(nonMinifiedFiles.concat(minifiedFiles), ['build-rover-js-dev']);
	});

	//JS - END
}