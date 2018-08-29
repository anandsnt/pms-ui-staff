module.exports = function(gulp, $, options){
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    zestJSMappingList 		= require("../../asset_list/js/zest/zestJsAssetList").getList(),
	    ZEST_JS_COMBINED_FILE  	= 'zest.js',
	    ZEST_JS_MANIFEST_FILE  	= "zest_js_manifest.json",
	    ZEST_TEMPLATE_ROOT     	= '../views/zest_station/home/',
	    runSequence 			= require('run-sequence'),
	    ZEST_HTML_FILE     		= ZEST_TEMPLATE_ROOT + 'index.html',
	    extendedMappings 		= [],
		generated 				= "____generated",
		onError  				= options.onError;

	//JS - Start
	gulp.task('compile-zest-js-production', function(){
		var nonMinifiedFiles 	= zestJSMappingList.nonMinifiedFiles,
			minifiedFiles 		= zestJSMappingList.minifiedFiles,
			paymentFiles        = zestJSMappingList.preCompiledFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(ZEST_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }})),

		    minifiedStream = gulp.src(minifiedFiles)
		    	.pipe($.jsvalidate())
				.on('error', onError)
		    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false})),

        	 paymentStream = gulp.src(paymentFiles, {base: '.'})
							.pipe($.babel())
							.pipe($.jsvalidate())
							.on('error', onError)
					        .pipe($.concat(ZEST_JS_COMBINED_FILE))
					        .pipe($.ngAnnotate({single_quotes: true}))
					        .pipe($.uglify({compress:true, output: {
					        	space_colon: false
					        }}));

	    return stream(minifiedStream, nonMinifiedStream, paymentStream)
	        .pipe($.concat(ZEST_JS_COMBINED_FILE))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ZEST_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	//Be careful: PRODUCTION
	gulp.task('inject-zest-js-production-to-template', function(){
	    var js_manifest_json = require(MANIFEST_DIR + ZEST_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[ZEST_JS_COMBINED_FILE];
	    
	    return gulp.src(ZEST_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Zest injecting js file (' + (file_name) + ") to "  + ZEST_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ZEST_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('zest-generate-mapping-list-dev', ['zest-copy-js-files'], function(){
		var glob 		= require('glob-all');
		extendedMappings = zestJSMappingList.minifiedFiles.concat(zestJSMappingList.nonMinifiedFiles).concat(zestJSMappingList.preCompiledFiles);
		extendedMappings = glob.sync(extendedMappings).map(function(e){
			return "/assets/" + e;
		});
	});

    gulp.task('zest-babelify-dev', ['rover-generate-mapping-list-dev'], function(){
        var fileList = [];

        fileList = fileList.concat(zestJSMappingList.preCompiledFiles);

        return gulp.src(fileList, {base: '.'})
            .pipe($.babel())
            .on('error', options.silentErrorShowing)
            .pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));

    });

	gulp.task('build-zeststation-js-dev', ['zest-babelify-dev', 'zest-generate-mapping-list-dev'], function(){
		//since extendedMappings contains /assets/ and that is not a valid before gulp.src
		var adminFiles = extendedMappings.map(function(e){  
			e = e.replace("/assets/", "");
			return e;
		});

	    return gulp.src(ZEST_HTML_FILE)
	        .pipe($.inject(gulp.src(adminFiles, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ZEST_TEMPLATE_ROOT, { overwrite: true }));
	});

	gulp.task('zest-watch-js-files', function(){
		var glob 	= require('glob-all'),
			fileList = zestJSMappingList.minifiedFiles.concat(zestJSMappingList.nonMinifiedFiles),
			fileList = glob.sync(fileList);

		gulp.watch(fileList).on('change', function(file) {
            $.onChangeJSinDev(file.path);
        });
	});
	
	gulp.task('zest-copy-js-files', function(){
		return gulp.src(zestJSMappingList.minifiedFiles.concat(zestJSMappingList.nonMinifiedFiles), {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});
	
	//JS - END
};
