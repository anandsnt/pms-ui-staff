module.exports = function(gulp, $, options){

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    GUESTWEB_TEMPLATES_FILE = 'guest_web_templates.min.js',
		GUESTWEB_TEMPLATE_ROOT  = options['GUESTWEB_TEMPLATE_ROOT'],
	    GUESTWEB_HTML_FILE     	= options['GUESTWEB_HTML_FILE'],
	    GUESTWEB_THEME_TEMPLATE_MAPPING_FILE = '../../asset_list/theming/guestweb/template/template_theme_mapping',
	    GUESTWEB_THEME_TEMPLATE_LIST = require(GUESTWEB_THEME_TEMPLATE_MAPPING_FILE).getThemeMappingList(),
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

	gulp.task('guestweb-template-theme-generate-mapping-list-prod', function(){
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(GUESTWEB_THEME_TEMPLATE_LIST).map(function(theme, index){
			console.log ('Guestweb Theme template - mapping-generation-started: ' + theme);
			var mappingList  = GUESTWEB_THEME_TEMPLATE_LIST[theme],
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
	});

	gulp.task('guestweb-template-cache-dev', function () {
		var glob = require('glob-all'),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			stream = require('merge-stream'),
			edit = require('gulp-json-editor');

		
		delete require.cache[require.resolve(GUESTWEB_THEME_TEMPLATE_MAPPING_FILE)];
		GUESTWEB_THEME_TEMPLATE_LIST = require(GUESTWEB_THEME_TEMPLATE_MAPPING_FILE).getThemeMappingList();

		var tasks = Object.keys(GUESTWEB_THEME_TEMPLATE_LIST).map(function(theme, index){
			console.log ('Guestweb Theme template - mapping-generation-started: ' + theme);
			var mappingList  = GUESTWEB_THEME_TEMPLATE_LIST[theme],
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