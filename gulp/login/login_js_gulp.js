module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		LOGIN_JS_COMBINED_FILE  = 'login.js',
		LOGIN_TEMPLATE_ROOT     = '../views/login/',
	    LOGIN_HTML_FILE     	= LOGIN_TEMPLATE_ROOT + 'new.html',
	    LOGIN_JS_MANIFEST_FILE  = "login_js_manifest.json",
	    onError  				= options.onError,
		LOGIN_JS_LIST 			= require("../../asset_list/js/loginJsAssetList").getList();
	
	//JS - Start
	gulp.task('compile-login-js-production', function(){
		var nonMinifiedFiles 	= LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= LOGIN_JS_LIST.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(LOGIN_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));

	    return stream(minifiedStream, nonMinifiedStream)
	        .pipe($.concat(LOGIN_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(LOGIN_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});


	//Be careful: PRODUCTION
	gulp.task('inject-login-js-production-to-template', function(){
	    var js_manifest_json = require(MANIFEST_DIR + LOGIN_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[LOGIN_JS_COMBINED_FILE];
	    
	    return gulp.src(LOGIN_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Login injecting js file (' + (file_name) + ") to "  + LOGIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-login-js-dev', ['login-copy-js-files'], function(){
		var nonMinifiedFiles 	= LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= LOGIN_JS_LIST.minifiedFiles;

	    return gulp.src(LOGIN_HTML_FILE)
	        .pipe($.inject(gulp.src(minifiedFiles.concat(nonMinifiedFiles), {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(LOGIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('login-copy-js-files', function(){
		return gulp.src(LOGIN_JS_LIST.nonMinifiedFiles.concat(LOGIN_JS_LIST.minifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('login-watch-js-files', function(){
		var nonMinifiedFiles 	= LOGIN_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= LOGIN_JS_LIST.minifiedFiles;
		gulp.watch(nonMinifiedFiles.concat(minifiedFiles), ['build-rover-js-dev']);
	});

	//JS - END
}