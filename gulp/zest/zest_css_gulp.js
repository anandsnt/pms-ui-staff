module.exports = function(gulp, $, options) {
	
	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ZEST_CSS_FILE  			= 'zest_station.css',
	    ZEST_TEMPLATE_ROOT     	= '../views/zest_station/home/',
	    ZEST_HTML_FILE     		= ZEST_TEMPLATE_ROOT + 'index.html',
	    ZEST_CSS_MANIFEST_FILE 	= "zest_css_manifest.json",
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
	    LESS_SOURCE_FILE 		= 'stylesheets/zest_station.css',
    	cleancss 				= new LessPluginCleanCSS({ advanced: true }),
		onError  				= options.onError,
		runSequence 			= require('run-sequence'),
		extendedMappings 		= {},
		generated 				= "____generated",
		ZESTSTAION_THEME_CSS_MAPPING_FILE 	= '../../asset_list/theming/zeststation/css/css_theme_mapping',
	    ZESTSTAION_THEME_CSS_LIST 			= require(ZESTSTAION_THEME_CSS_MAPPING_FILE).getThemeMappingList(),
	    zestStationGenDir 		= DEST_ROOT_PATH + 'asset_list/' + generated + 'ThemeMappings/' + generated + 'ZestStation/css/',
		zeststationGenFile 		= zestStationGenDir + generated + 'ZestStationCSSThemeMappings.json';

	gulp.task('create-zest-theme-mapping-css-production', function(){
	    var mkdirp = require('mkdirp'),
			fs = require('fs');
		
		mkdirp(zestStationGenDir, function (err) {
		    if (err) console.error('zeststation theme css mapping directory failed!! (' + err + ')');
	    	fs.writeFile(zeststationGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('zeststation theme css mapping file failed!! (' + err + ')');
			    }
			    console.log('zeststation theme css mapping file created (' + zeststationGenFile + ')');
			}); 
		});
	});

	gulp.task('zeststation-css-theme-generate-mapping-list-prod', function(){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(ZESTSTAION_THEME_CSS_LIST).map(function(theme, index){
			console.log ('Zest Station Theme CSS - mapping-generation-started: ' + theme);
			var mappingList  = ZESTSTAION_THEME_CSS_LIST[theme],
				fileName 	 = theme.replace(/\./g, "-")+".min.css";
			
			return gulp.src(mappingList, {base: '.'})
				.pipe($.less({
		        	compress: true,
		        	plugins: [cleancss]
		        }))
		        .on('error', onError)
		        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: true}).on('error', onError))
		        .pipe($.rev())
		        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
		        .pipe($.rev.manifest())
		        .pipe(edit(function(manifest){
		        	Object.keys(manifest).forEach(function (path, orig) {
				    	extendedMappings[theme] = [URL_APPENDER + "/" + manifest[path]];
				    	console.log ('Zest Station Theme CSS - mapping-generation-ended: ' + theme + " => " + manifest[path]);
				    });
		        	return {};
		        }));
		});
		return es.merge(tasks);
	});

	gulp.task('zeststation-css-theme-generate-mapping-list-dev', function(){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(ZESTSTAION_THEME_CSS_LIST).map(function(theme, index){
			console.log ('Zest Station Theme CSS - mapping-generation-started: ' + theme);
			var mappingList = ZESTSTAION_THEME_CSS_LIST[theme],
				fileName 	= theme + ".css";
			
			return gulp.src(mappingList, {base: '.'})
				.pipe($.less({
		        	plugins: [cleancss]
		        }))
		        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: false, aggressiveMerging: false, mediaMerging: false}).on('error', onError))
		        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true });
		});
		return es.merge(tasks).on('end', function(){
			runSequence('create-zest-theme-mapping-css-production');
		});
	});

	gulp.task('build-zeststation-css-dev', ['zeststation-copy-css-files-dev', 'zeststation-css-theme-generate-mapping-list-dev']);

	gulp.task('zeststation-copy-css-files-dev', function(){
		delete require.cache[require.resolve(ZESTSTAION_THEME_CSS_MAPPING_FILE)];
		ZESTSTAION_THEME_CSS_LIST 	= require(ZESTSTAION_THEME_CSS_MAPPING_FILE).getThemeMappingList();

		var guestwebSourceList = '';
		Object.keys(ZESTSTAION_THEME_CSS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(ZESTSTAION_THEME_CSS_LIST[theme]);			
		});
		guestwebSourceList = guestwebSourceList.concat(['zeststation/css/**/*.svg', 'zeststation/css/**/*.cur'])
		return gulp.src(guestwebSourceList, {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('zeststation-watch-css-files', function(){
		delete require.cache[require.resolve(ZESTSTAION_THEME_CSS_MAPPING_FILE)];
		ZESTSTAION_THEME_CSS_LIST 	= require(ZESTSTAION_THEME_CSS_MAPPING_FILE).getThemeMappingList();

		var guestwebSourceList = '';
		Object.keys(ZESTSTAION_THEME_CSS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(ZESTSTAION_THEME_CSS_LIST[theme]);			
		});
		guestwebSourceList = guestwebSourceList.concat('asset_list/js/zeststation/**/*.js', 'asset_list/theming/zeststation/**/*.js');
		return gulp.watch(guestwebSourceList, function(callback){
			return runSequence('build-zeststation-css-dev', 'copy-zeststation-base-html');
		});
	});
}
