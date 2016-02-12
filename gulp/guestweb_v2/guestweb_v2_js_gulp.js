module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_V2_JS_COMBINED_FILE  = 'gusetweb_v2.js',
		GUESTWEB_V2_TEMPLATE_ROOT     = options['GUESTWEB_V2_TEMPLATE_ROOT'],
	    GUESTWEB_V2_HTML_FILE     	= options['GUESTWEB_V2_HTML_FILE'],
	    GUESTWEB_V2_JS_MANIFEST_FILE  = "gusetweb_v2_js_manifest.json",
	    onError  				= options.onError,
	    runSequence 			= require('run-sequence'),
		GUESTWEB_V2_JS_LIST     = require("../../asset_list/js/guestweb_v2/guestwebAssetList").getList();
	
	//JS - Start
	gulp.task('compile-guestweb-v2-js-production', function(){
		var nonMinifiedFiles 	= GUESTWEB_V2_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_V2_JS_LIST.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(GUESTWEB_V2_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));

	    return stream(minifiedStream, nonMinifiedStream)
	        .pipe($.concat(GUESTWEB_V2_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(GUESTWEB_V2_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('inject-guestweb-v2-js-production-to-template', function(){
	    var js_manifest_json = require(MANIFEST_DIR + GUESTWEB_V2_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[GUESTWEB_V2_JS_COMBINED_FILE];
	    
	    return gulp.src(GUESTWEB_V2_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Login injecting js file (' + (file_name) + ") to "  + GUESTWEB_V2_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(GUESTWEB_V2_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-guestweb-v2-js-dev', ['guestweb-v2-copy-js-files'], function(){
		var nonMinifiedFiles 	= GUESTWEB_V2_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_V2_JS_LIST.minifiedFiles;

	    return gulp.src(GUESTWEB_V2_HTML_FILE)
	        .pipe($.inject(gulp.src(minifiedFiles.concat(nonMinifiedFiles), {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(GUESTWEB_V2_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('guestweb-v2-copy-js-files', function(){
		return gulp.src(GUESTWEB_V2_JS_LIST.nonMinifiedFiles.concat(GUESTWEB_V2_JS_LIST.minifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('guestweb-v2-watch-js-files', function(){
		var nonMinifiedFiles 	= GUESTWEB_V2_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_V2_JS_LIST.minifiedFiles;
		gulp.watch(nonMinifiedFiles.concat(minifiedFiles), function(callback){
			return runSequence('build-guestweb-v2-js-dev', 'copy-guestweb-v2-base-html')
		});
	});

	//JS - END
}