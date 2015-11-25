module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
	    ROVER_ASSET_LIST_ROOT   = '../rover/',
	    ROVER_JS_ASSET_LIST     = require ("./asset_list/roverJsAssetList").getList(), //require ("./asset_list/dashboardJsAssetList").getList(),
	    ROVER_TEMPLATES_FILE    = 'rover_templates.js',
	    ROVER_JS_COMBINED_FILE  = 'rover.js',
	    ROVER_CSS_FILE  		= 'rover.css',
	    ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
	    ROVER_HTML_FILE     	= ROVER_TEMPLATE_ROOT + 'rover.html',
	    ROVER_JS_MANIFEST_FILE  = "rover_js_manifest.json",
	    ROVER_CSS_MANIFEST_FILE = "rover_css_manifest.json",
	    PARTIALS_PATH_LIST 		= ['**/*.html'],
	    ROVER_TEMPLTE_MANFEST_FILE = "rover_template_manifest.json",
	    LessPluginCleanCSS = require('less-plugin-clean-css'),
    	cleancss = new LessPluginCleanCSS({ advanced: true });

	//JS - Start
	gulp.task('compile-rover-js-production', ['copy-all-dev'], function(){
	    return gulp.src(ROVER_JS_ASSET_LIST)
	        .pipe($.concat(ROVER_JS_COMBINED_FILE))
	        .pipe($.ngAnnotate({single_quotes: true}))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ROVER_JS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	//Be careful: PRODUCTION
	gulp.task('build-rover-js-production', ['compile-rover-js-production'], function(){
	    var js_manifest_json = require(MANIFEST_DIR + ROVER_JS_MANIFEST_FILE),
	        file_name = js_manifest_json[ROVER_JS_COMBINED_FILE];
	    
	    return gulp.src(ROVER_HTML_FILE)
	        .pipe($.inject(gulp.src(DEST_ROOT_PATH + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('build-rover-js-dev', ['copy-all-dev'], function(){
	    return gulp.src(ROVER_HTML_FILE)
	        .pipe($.inject(gulp.src(ROVER_JS_ASSET_LIST, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	});

	//JS - END
	
	//Template - START
	var templateInjector = function(fileName) {
		return gulp.src(ROVER_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:templates:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	};

	//Be careful: PRODUCTION
	gulp.task('build-rover-template-cache-production', ['rover-template-cache-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ROVER_TEMPLTE_MANFEST_FILE),
	        file_name = template_manifest_json[ROVER_TEMPLATES_FILE];
	    return templateInjector(file_name);
	});

	//Be careful: PRODUCTION
	gulp.task('rover-template-cache-production', function () {
	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'rover/'})
	  		.pipe($.minifyHTML({
	  			conditionals: true,
    			spare:true,
    			empty: true
	  		}))
	        .pipe($.templateCache(ROVER_TEMPLATES_FILE, {
	            module: 'sntRover',
	            root: URL_APPENDER
	        }))
	        .pipe($.uglify({compress:true}))
			.pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ROVER_TEMPLTE_MANFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('build-rover-template-cache-dev', ['rover-template-cache-dev'], function(){
	    return templateInjector(ROVER_TEMPLATES_FILE);
	});

	gulp.task('rover-template-cache-dev', ['copy-all-dev'], function () {

	  return gulp.src(PARTIALS_PATH_LIST, {cwd:'rover/'})
	        .pipe($.templateCache(ROVER_TEMPLATES_FILE, {
	            module: 'sntRover',
	            root: URL_APPENDER
	        }))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//Template - END
	
	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ROVER_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('build-rover-less-production', ['rover-less-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ROVER_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[ROVER_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('rover-less-production', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/rover.css')
	        .pipe($.less({
	        	compress: true,
	        	plugins: [cleancss]
	        }))
	        .pipe($.minifyCSS())
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ROVER_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('rover-less-dev', ['copy-all-dev'], function () {
	  return gulp.src('stylesheets/rover.css')
	        .pipe($.less({
				plugins: [cleancss]
			}))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-rover-less-dev', ['rover-less-dev'], function(){
	    return cssInjector(ROVER_CSS_FILE);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-rover-less-js-dev', ['rover-less-dev', 'build-rover-js-dev'], function(){
	    return cssInjector(ROVER_CSS_FILE);
	});
	//LESS END
	
	gulp.task('concat-translation-en-files-dev', ['copy-all-dev'], function(){
		return gulp.src(['rover/rvLocales/en/*.json'])
			.pipe($.translationConcat(DEST_ROOT_PATH + 'rvLocales/EN.json', {sep: ',', process: function(src){
				return (src.trim().replace(/\n/g, ''));
			}}))
			.pipe($.translationConcat.header('{'))
			.pipe($.translationConcat.footer('}'))
			.pipe($.jsonminify())
			.pipe(gulp.dest(DEST_ROOT_PATH));
	});

	//TASKS
	gulp.task('build-rover-dev', ['build-rover-less-js-dev', 'build-rover-template-cache-dev', 'concat-translation-en-files-dev']);
	gulp.task('rover-asset-precompile', ['build-rover-js-production', 'build-rover-template-cache-production', 'build-rover-less-production', 'concat-translation-en-files-dev']);
}