module.exports = function (gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		GUESTWEB_CSS_FILE  		= 'login.css',
	    GUESTWEB_CSS_MANIFEST_FILE = "login_css_manifest.json",
		GUESTWEB_TEMPLATE_ROOT  = options['GUESTWEB_TEMPLATE_ROOT'],
	    GUESTWEB_HTML_FILE     	= options['GUESTWEB_HTML_FILE'],
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
    	cleancss 				= new LessPluginCleanCSS({advanced: true }),
    	nano 					= require('gulp-cssnano'),
    	runSequence 			= require('run-sequence'),
		onError  				= options.onError,
		extendedMappings 		= {},
		runSequence 			= require('run-sequence'),
		generated 				= "____generated",
	    GUESTWEB_THEME_CSS_MAPPING_FILE = '../../asset_list/theming/guestweb/css/css_theme_mapping',
	    GUESTWEB_THEME_CSS_LIST 	= require(GUESTWEB_THEME_CSS_MAPPING_FILE).getThemeMappingList(),
	    CSS_FILES 				= ['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'guestweb/img/**/**.*', 'guestweb/common_images/**/**.*'],
		guestwebGenDir 			= DEST_ROOT_PATH + 'asset_list/' + generated + 'ThemeMappings/' + generated + 'Guestweb/css/',
		guestwebGenFile 		= guestwebGenDir + generated + 'GuestWebCSSThemeMappings.json';

	gulp.task('create-theme-mapping-css-production', function(){
	    var mkdirp = require('mkdirp'),
			fs = require('fs');
		
		mkdirp(guestwebGenDir, function (err) {
		    if (err) console.error('guestweb theme css mapping directory failed!! (' + err + ')');
	    	fs.writeFile(guestwebGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('guestweb theme css mapping file failed!! (' + err + ')');
			    }
			    console.log('guestweb theme css mapping file created (' + guestwebGenFile + ')');
			}); 
		});
	});

	gulp.task('guestweb-css-theme-generate-mapping-list-prod', function(){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(GUESTWEB_THEME_CSS_LIST).map(function(theme, index){
			console.log ('Guestweb Theme CSS - mapping-generation-started: ' + theme);
			var mappingList  = GUESTWEB_THEME_CSS_LIST[theme],
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
				    	console.log ('Guestweb Theme CSS - mapping-generation-ended: ' + theme + " => " + manifest[path]);
				    });
		        	return {};
		        }));
		});
		return es.merge(tasks);
	});

	gulp.task('guestweb-css-theme-generate-mapping-list-dev', function(){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');
		
		delete require.cache[require.resolve(GUESTWEB_THEME_CSS_MAPPING_FILE)];
		GUESTWEB_THEME_CSS_LIST = require(GUESTWEB_THEME_CSS_MAPPING_FILE).getThemeMappingList();

		var tasks = Object.keys(GUESTWEB_THEME_CSS_LIST).map(function(theme, index){
			console.log ('Guestweb Theme CSS - mapping-generation-started: ' + theme);
			var mappingList  	= GUESTWEB_THEME_CSS_LIST[theme],
				fileName 		= theme + ".css";
			
			return gulp.src(mappingList, {base: '.'})
				.pipe($.less({
		        	plugins: [cleancss]
		        })).on('error', options.silentErrorShowing)
		        .pipe($.concat(fileName))
		        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: false, aggressiveMerging:false, mediaMerging:false}).on('error', options.silentErrorShowing))
		        .on('end', function(){
		        	extendedMappings[theme] = [URL_APPENDER + "/" + fileName ];
		        	console.log ('Guestweb Theme CSS - mapping-generation-ended: ' + fileName);
		        })
		        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true });
		});
		return es.merge(tasks).on('end', function(){
			return runSequence('create-theme-mapping-css-production')
		 });
	});

	gulp.task('build-guestweb-css-dev', ['guestweb-copy-css-files-dev', 'guestweb-css-theme-generate-mapping-list-dev']);

	gulp.task('guestweb-copy-css-files-dev', function(){
		delete require.cache[require.resolve(GUESTWEB_THEME_CSS_MAPPING_FILE)];
		GUESTWEB_THEME_CSS_LIST 	= require(GUESTWEB_THEME_CSS_MAPPING_FILE).getThemeMappingList();

		var guestwebSourceList = [];
		Object.keys(GUESTWEB_THEME_CSS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(GUESTWEB_THEME_CSS_LIST[theme]);			
		});
		guestwebSourceList = guestwebSourceList.concat(['guestweb/img/**/*.*', 'guestweb/common_images/**/*.*']);
		return gulp.src(guestwebSourceList, {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});

	gulp.task('guestweb-watch-css-files', function(){
		delete require.cache[require.resolve(GUESTWEB_THEME_CSS_MAPPING_FILE)];
		GUESTWEB_THEME_CSS_LIST 	= require(GUESTWEB_THEME_CSS_MAPPING_FILE).getThemeMappingList();

		var guestwebSourceList = [];
		Object.keys(GUESTWEB_THEME_CSS_LIST).map(function(theme, index){
			guestwebSourceList 	= guestwebSourceList.concat(GUESTWEB_THEME_CSS_LIST[theme]);			
		});
		guestwebSourceList = guestwebSourceList.concat(['guestweb/**/*.less', 'asset_list/js/guestweb/**/*.js', 'asset_list/theming/guestweb/css/*.js']);
		console.log(guestwebSourceList);
		return gulp.watch(guestwebSourceList, function(callback){
			return runSequence('build-guestweb-css-dev', 'copy-guestweb-base-html');
		});
	});
}