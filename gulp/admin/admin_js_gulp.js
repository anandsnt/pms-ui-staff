module.exports = function(gulp, $, options){
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    adminJSMappingList 		= require("../../asset_list/js/adminJsAssetList").getList(),
	    ADMIN_JS_COMBINED_FILE  = 'admin.js',
	    ADMIN_JS_MANIFEST_FILE  = "admin_js_manifest.json",
	    ADMIN_TEMPLATE_ROOT     = '../views/admin/settings/',
	    ADMIN_HTML_FILE     	= ADMIN_TEMPLATE_ROOT + 'settings.html',
	    extendedMappings 		= [],
		onError  				= options.onError;

	//JS - Start
	gulp.task('compile-admin-js-production', function(){
		var nonMinifiedFiles 	= adminJSMappingList.nonMinifiedFiles,
			minifiedFiles 		= adminJSMappingList.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(ADMIN_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));

	    return stream(minifiedStream, nonMinifiedStream)
	        .pipe($.concat(ADMIN_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ADMIN_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	//Be careful: PRODUCTION
	gulp.task('build-admin-js-production', ['compile-admin-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + ADMIN_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[ADMIN_JS_COMBINED_FILE];
	    
	    return gulp.src(ADMIN_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('admin-generate-mapping-list-dev', ['admin-copy-js-files'], function(){
		var glob 		= require('glob-all');
		extendedMappings = adminJSMappingList.minifiedFiles.concat(adminJSMappingList.nonMinifiedFiles);
		extendedMappings = glob.sync(extendedMappings).map(function(e){
			return "/assets/" + e;
		});
	});

	gulp.task('build-admin-js-dev', ['admin-generate-mapping-list-dev'], function(){
		//since extendedMappings contains /assets/ and that is not a valid before gulp.src
		var adminFiles = extendedMappings.map(function(e){  
			e = e.replace("/assets/", "");
			return e;
		});

	    return gulp.src(ADMIN_HTML_FILE)
	        .pipe($.inject(gulp.src(adminFiles, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('admin-watch-js-files', function(){
		var glob 	= require('glob-all'),
			fileList = adminJSMappingList.minifiedFiles.concat(adminJSMappingList.nonMinifiedFiles),
			fileList = glob.sync(fileList);
		gulp.watch(fileList, ['build-admin-js-dev'])
	});
	
	gulp.task('admin-copy-js-files', function(){
		return gulp.src(adminJSMappingList.minifiedFiles.concat(adminJSMappingList.nonMinifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});
	
	//JS - END
};