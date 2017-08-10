module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_JS_COMBINED_FILE  = 'guest_web.min.js',
		GUESTWEB_TEMPLATE_ROOT  = options['GUESTWEB_TEMPLATE_ROOT'],
	    GUESTWEB_HTML_FILE     	= options['GUESTWEB_HTML_FILE'],
	    GUESTWEB_JS_MANIFEST_FILE  = "guestweb_js_manifest.json",
	    onError  				= options.onError,
	    runSequence 			= require('run-sequence'),
	    extendedMappings 		= {},
		generated 				= "____generated",
	    GUESTWEB_THEME_JS_MAPPING_FILE 	= '../../asset_list/theming/guestweb/js/js_theme_mapping',
	    GUESTWEB_THEME_JS_LIST 	= require(GUESTWEB_THEME_JS_MAPPING_FILE).getThemeMappingList(),
		GUESTWEB_JS_LIST 		= require("../../asset_list/js/guestweb/guestwebAssetList").getList(),
		guestwebGenDir 			= DEST_ROOT_PATH + 'asset_list/' + generated + 'ThemeMappings/' + generated + 'Guestweb/js/',
		guestwebGenFile 		= guestwebGenDir + generated + 'GuestWebJsThemeMappings.json';

	var extractJSMappingList = function() {
		var argv = require('yargs').argv;
		var guestWebThemeJsList = {};

		/*
        For developement purspose, we can pass only required themes as array, i.e. as follows

        gulp <gulp-task> --with_gw ['guestweb_zoku','guestweb_yotel'] etc

        In this case argv.with_gw will return string => '[guestweb_zoku,guestweb_yotel]'
		
		In such cases, guestWebThemeJsList has to be generated like below
        */

		// {
		// 	guestweb_zoku: ['guestweb/scripts/app_router_zoku.js',
		// 		'guestweb/zest/**/*.js'
		// 	],
		// 	guestweb_yotel: ['guestweb/scripts/app_router_yotel.js',
		// 		'guestweb/zest/**/*.js'
		// 	]
		// }

		if ('with_gw' in argv && typeof argv.with_gw === 'string') {
			// required zest web themes are passed
			var themeString = argv.with_gw;
			//themeString will be string => '[guestweb_zoku,guestweb_yotelguestweb_zoku]'
			// strip [ and ] from string
			themeString = themeString.substring(1, themeString.length - 1)
			var themeArray = themeString.split(",");
			for (var i = 0, len = themeArray.length; i < len; i++) {
				var themeJSlist;
				if( typeof GUESTWEB_THEME_JS_LIST[themeArray[i]] === 'undefined'){
					themeJSlist = GUESTWEB_THEME_JS_LIST['guestweb_common_js_files'];
				}else{
					themeJSlist = GUESTWEB_THEME_JS_LIST[themeArray[i]];
				}
				guestWebThemeJsList[themeArray[i]] = themeJSlist;
			}

		} else {
			guestWebThemeJsList = GUESTWEB_THEME_JS_LIST;
		}
		return guestWebThemeJsList;
	};

	//JS - Start
	gulp.task('compile-guestweb-dashboard-js-production', function(){
		var nonMinifiedFiles 	= GUESTWEB_JS_LIST.nonMinifiedFiles,
			minifiedFiles 		= GUESTWEB_JS_LIST.minifiedFiles,
			stream 				= require('merge-stream');

		var nonMinifiedStream = gulp.src(nonMinifiedFiles)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(GUESTWEB_JS_COMBINED_FILE))
		        .pipe($.ngAnnotate({single_quotes: true}))
		        .pipe($.uglify({compress:true,mangle:false, output: {
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

	gulp.task('guestweb-js-theme-generate-mapping-list-prod', function(){
		var glob = require('glob-all'),
			fileList = [],
			es = require('event-stream'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(GUESTWEB_THEME_JS_LIST).map(function(theme, index){
			console.log ('Guestweb Theme JS - mapping-generation-started: ' + theme);
			var mappingList  = GUESTWEB_THEME_JS_LIST[theme],
				fileName 	 = theme.replace(/\./g, "-")+".min.js";
			
			return gulp.src(mappingList)
				.pipe($.jsvalidate())
				.on('error', onError)
		        .pipe($.concat(fileName))
		        .on('error', onError)
		        .pipe($.ngAnnotate({single_quotes: true, debug: true}))
		        .on('error', onError)
		        .pipe($.uglify({compress:true, output: {
		        	space_colon: false
		        }}))
		        .on('error', onError)
		        .pipe($.rev())
		        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
		        .pipe($.rev.manifest())
		        .pipe(edit(function(manifest){
		        	Object.keys(manifest).forEach(function (path, orig) {
				    	extendedMappings[theme] = [URL_APPENDER + "/" + manifest[path]];
				    });
				    console.log ('Guestweb Theme JS - mapping-generation-ended: ' + theme);
		        	return {};
		        }));
		});
		return es.merge(tasks);
	});
	
	gulp.task('guestweb-js-production', ['compile-guestweb-dashboard-js-production', 'guestweb-js-theme-generate-mapping-list-prod']);

	gulp.task('create-guestweb-theme-js-list', function(){
		var fs = require('fs-extra');
		return fs.outputJsonSync(guestwebGenFile, extendedMappings);
	});

	gulp.task('cache-invalidate-guestweb-js-production', ['create-guestweb-theme-js-list'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + GUESTWEB_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[GUESTWEB_JS_COMBINED_FILE],
			edit = require('gulp-json-editor');
		//cache invalidating
	    return gulp.src(guestwebGenFile, {base: '.'})
		    .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
	        .pipe($.rev.manifest())
	        .pipe(edit(function(manifest){
	        	gulp.src('../../public/assets/' + file_name)
	        	.pipe($.replace(/\/assets\/asset_list\/____generatedThemeMappings\/____generatedGuestweb\/js\/____generatedGuestWebJsThemeMappings.json/g , 
	        		URL_APPENDER + '/' + manifest[Object.keys(manifest)[0]]))
	        	.pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true });
	        	console.log('guestweb theme js mapping file created (' + manifest[Object.keys(manifest)[0]] + ')');
	        	return {};
	        }));
	});

	//Be careful: PRODUCTION
	gulp.task('create-statemapping-and-inject-guestweb-js-production', ['cache-invalidate-guestweb-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + GUESTWEB_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[GUESTWEB_JS_COMBINED_FILE],
			edit = require('gulp-json-editor');		
	    return gulp.src(GUESTWEB_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Guestweb injecting js file (' + (file_name) + ") to "  + GUESTWEB_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(GUESTWEB_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('guestweb-js-theme-generate-mapping-list-dev', function(){
		var glob = require('glob-all'),
			fs 	= require('fs'),
			mkdirp = require('mkdirp');

		delete require.cache[require.resolve(GUESTWEB_THEME_JS_MAPPING_FILE)];
		GUESTWEB_THEME_JS_LIST 	= extractJSMappingList();
		

		Object.keys(GUESTWEB_THEME_JS_LIST).map(function(theme, index){
			console.log ('Guestweb Theme JS - mapping-generation-started: ' + theme);		
			extendedMappings[theme] = glob.sync(GUESTWEB_THEME_JS_LIST[theme]).map(function(e){
				return "/assets/" + e;
			});
			console.log ('Guestweb Theme JS - mapping-generation-ended: ' + theme);
		});	

		return mkdirp(guestwebGenDir, function (err) {
		    if (err) console.error('guestweb theme js mapping directory failed!! (' + err + ')');
	    	fs.writeFile(guestwebGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('guestweb theme js mapping file failed!! (' + err + ')');
			    }
			    console.log('guestweb theme js mapping file created (' + guestwebGenFile + ')');
			}); 
		});
	});

	gulp.task('build-guestweb-js-dev', ['guestweb-copy-js-files-dev', 'guestweb-js-theme-generate-mapping-list-dev'], function(){
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

	gulp.task('guestweb-copy-js-files-dev', function(){
		delete require.cache[require.resolve(GUESTWEB_THEME_JS_MAPPING_FILE)];
		GUESTWEB_THEME_JS_LIST 	= extractJSMappingList();

		var guestwebSourceList = GUESTWEB_JS_LIST.nonMinifiedFiles.concat(GUESTWEB_JS_LIST.minifiedFiles);
		Object.keys(GUESTWEB_THEME_JS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(GUESTWEB_THEME_JS_LIST[theme]);			
		});
		return gulp.src(guestwebSourceList, {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('guestweb-watch-js-files', function(){
		delete require.cache[require.resolve(GUESTWEB_THEME_JS_MAPPING_FILE)];
		GUESTWEB_THEME_JS_LIST 	= extractJSMappingList();

		var guestwebSourceList = GUESTWEB_JS_LIST.nonMinifiedFiles.concat(GUESTWEB_JS_LIST.minifiedFiles);
		Object.keys(GUESTWEB_THEME_JS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(GUESTWEB_THEME_JS_LIST[theme]);			
		});
		guestwebSourceList = guestwebSourceList.concat(['asset_list/js/guestweb/**/*.js', 'asset_list/theming/guestweb/js/*.js']);
		return gulp.watch(guestwebSourceList, function(callback){
			return runSequence('build-guestweb-js-dev', 'copy-guestweb-base-html');
		});
	});

	//JS - END
}
