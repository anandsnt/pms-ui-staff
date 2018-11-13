module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    GUESTWEB_TEMPLATES_FILE = 'guest_web_templates.min.js',
		GUESTWEB_TEMPLATE_ROOT  = options['GUESTWEB_TEMPLATE_ROOT'],
	    GUESTWEB_HTML_FILE     	= options['GUESTWEB_HTML_FILE'],
	    GUESTWEB_THEME_TEMPLATE_MAPPING_FILE = '../../asset_list/theming/guestweb/template/template_theme_mapping_a',
	    GUESTWEB_THEME_TEMPLATE_MAPPING_NEW_FILE = '../../asset_list/theming/guestweb/template/template_theme_mappings_b'
	    GUESTWEB_THEME_TEMPLATE_LIST = require(GUESTWEB_THEME_TEMPLATE_MAPPING_FILE).getThemeMappingList(),
	    GUESTWEB_NEW_THEME_TEMPLATE_LIST = require(GUESTWEB_THEME_TEMPLATE_MAPPING_NEW_FILE).getThemeMappingList(),
	    GUESTWEB_PARTIALS 		= ['guestweb/**/**/*.html'],
	    GUESTWEB_TEMPLTE_MANFEST_FILE = "guest_web_template_manifest.json",
	    GUESTWEB_JS_COMBINED_FILE  = 'guest_web.min.js',
		GUESTWEB_JS_MANIFEST_FILE  = "guestweb_js_manifest.json",
	    extendedMappings 		= {},
	    runSequence 			= require('run-sequence'),
		generated 				= "____generated",
	    onError 				= options.onError,
	    runSequence 			= require('run-sequence'),
	    guestwebGenDir 			= DEST_ROOT_PATH + 'asset_list/' + generated + 'ThemeMappings/' + generated + 'Guestweb/template/',
		guestwebGenFile 		= guestwebGenDir + generated + 'GuestWebTemplateThemeMappings.json';

	var extractThemeMappingList = function(theme_list) {
		var argv = require('yargs').argv;
		var guestWebThemeList = {};

		/*
		For developement purspose, we can pass only required themes as array, i.e. as follows
        
		gulp <gulp-task> --with_gw ['guestweb_zoku','guestweb_yotel'] etc
        
		In such cases, guestWebThemeList  has to be generated like below 
		*/

		// {
		// 	guestweb_zoku: ['guestweb/**/common_templates/partials/checkin/**.html',
		// 		......
		// 		'guestweb/**/preCheckin/partials/*.html'
		// 	],
		// 	guestweb_yotel: ['guestweb/**/landing/Yotel/*.html',
		// 		..........
		// 		'guestweb/**/shared/**/*.html'
		// 	]
		// }

		if ('with_gw' in argv && typeof argv.with_gw === 'string') {
			// required zest web themes are passed
			var themeString = argv.with_gw;
			// themeString will be string => '[guestweb_zoku,guestweb_yotelguestweb_zoku]'
			// strip [ and ] from string
			themeString = themeString.substring(1, themeString.length - 1)
			var themeArray = themeString.split(",");
			for (var i = 0, len = themeArray.length; i < len; i++) {
				if (theme_list[themeArray[i]]) {
					var themelist = theme_list[themeArray[i]] || theme_list['guestweb_common_templates'];
					guestWebThemeList[themeArray[i]] = themelist;
				}
			}
		} else {
			guestWebThemeList = theme_list;
		}
		return guestWebThemeList;
	};

	gulp.task('create-guestweb-theme-template-list', function(){
		var fs = require('fs-extra');
		return fs.outputJsonSync(guestwebGenFile, extendedMappings);
	});

	gulp.task('create-theme-mapping-template-production', ['create-guestweb-theme-template-list'], function(){
	    var edit = require('gulp-json-editor'),
			js_manifest_json = require(MANIFEST_DIR + GUESTWEB_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[GUESTWEB_JS_COMBINED_FILE];
			//cache invalidating
		    return gulp.src(guestwebGenFile, {base: '.'})
		    .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
	        .pipe($.rev.manifest())
	        .pipe(edit(function(manifest){
	        	gulp.src('../../public/assets/' + file_name)
	        	.pipe($.replace(/\/assets\/asset_list\/____generatedThemeMappings\/____generatedGuestweb\/template\/____generatedGuestWebTemplateThemeMappings.json/g , 
	        		URL_APPENDER + '/' + manifest[Object.keys(manifest)[0]]))
	        	.pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true });
	        	console.log('guestweb theme template mapping file created (' + manifest[Object.keys(manifest)[0]] + ')');
	        	return {};
	        }));
	});

	var prodGenerateMappingListTasks = function(theme_list){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(theme_list).map(function(theme, index){
			console.log ('Guestweb Theme template - mapping-generation-started: ' + theme);
			var mappingList  = theme_list[theme],
				fileName 	 = theme.replace(/\./g, "-")+"-template.min.js";

			return gulp.src(mappingList)
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(fileName, {
	            module: 'sntGuestWebTemplates',
	            root: URL_APPENDER
	        }).on('error', onError))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}).on('error', onError))
			.pipe($.rev().on('error', onError))
	        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
	        .pipe($.rev.manifest())
	        .pipe(edit(function(manifest){
	        	Object.keys(manifest).forEach(function (path, orig) {
			    	extendedMappings[theme] = [URL_APPENDER + "/" + manifest[path]];
			    });
			    console.log ('Guestweb Theme template - mapping-generation-ended: ' + theme);
	        	return {};
	        }));
		});
		return es.merge(tasks);
	};

	gulp.task('guestweb-template-theme-generate-mapping-list-prod-v2', function(){
		return prodGenerateMappingListTasks(GUESTWEB_NEW_THEME_TEMPLATE_LIST);
	});

	gulp.task('guestweb-template-theme-generate-mapping-list-prod', function(){
		return prodGenerateMappingListTasks(GUESTWEB_THEME_TEMPLATE_LIST);
	});

	var devGenerateMappingListTasks = function(theme_list){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		
		delete require.cache[require.resolve(GUESTWEB_THEME_TEMPLATE_MAPPING_FILE)];
		delete require.cache[require.resolve(GUESTWEB_THEME_TEMPLATE_MAPPING_NEW_FILE)];

		theme_list = extractThemeMappingList(theme_list);

		var tasks = Object.keys(theme_list).map(function(theme, index){
			console.log ('Guestweb Theme template - mapping-generation-started: ' + theme);
			var mappingList  = theme_list[theme],
				fileName 	 = theme.replace(/\./g, "-")+"-template.js";

			return gulp.src(mappingList)
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(fileName, {
	            module: 'sntGuestWebTemplates',
	            root: URL_APPENDER
	        }).on('error', onError))
	        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true }).on('end', function(){
	        	extendedMappings[theme] = [URL_APPENDER + "/" + fileName];
	        	console.log ('Guestweb Theme template - mapping-generation-end: ' + theme);
	        });
		});
		return es.merge(tasks).on('end', function(){
			return mkdirp(guestwebGenDir, function (err) {
		    if (err) console.error('guestweb theme template mapping directory failed!! (' + err + ')');
	    	fs.writeFile(guestwebGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('guestweb theme template mapping file failed!! (' + err + ')');
			    }
			    console.log('guestweb theme template mapping file created (' + guestwebGenFile + ')');
			}); 
		});
		});
	};

	gulp.task('guestweb-template-cache-dev-v2', function(){
		return devGenerateMappingListTasks(GUESTWEB_NEW_THEME_TEMPLATE_LIST);
	});

	gulp.task('guestweb-template-cache-dev', function(){
		return devGenerateMappingListTasks(GUESTWEB_THEME_TEMPLATE_LIST);
	});

	//Template - END

	//LESS END
	gulp.task('guestweb-watch-partials', function(){
		GUESTWEB_PARTIALS = GUESTWEB_PARTIALS.concat(['asset_list/theming/guestweb/template/*.js']);
		return gulp.watch(GUESTWEB_PARTIALS, function(){
			return runSequence('guestweb-template-cache-dev', 'copy-guestweb-base-html');
		});
	});

}
