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
		onError  				= options.onError;

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ZEST_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ZEST_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('build-zest-less-production', ['zest-less-production'], function(){
		var template_manifest_json = require(MANIFEST_DIR + ZEST_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[ZEST_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('zest-less-production', ['zest-copy-less-files'], function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
	        	compress: true,
	        	plugins: [cleancss]
	        }))
	        .pipe($.minifyCSS())
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ZEST_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('zest-less-dev', ['zest-copy-less-files'], function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
				plugins: [cleancss]
			}))
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-zest-less-dev', ['zest-less-dev'], function(){
	    return cssInjector(ZEST_CSS_FILE);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-zest-less-js-dev', ['zest-less-dev', 'build-zest-js-dev'], function(){
	    return cssInjector(ZEST_CSS_FILE);
	});
	//LESS END
	//
	
	gulp.task('zest-watch-less-files', function(){
		var paths = [LESS_SOURCE_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'zest/css/**/*.*']);
		gulp.watch(paths, ['build-zest-less-dev']);
	});

	gulp.task('zest-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'zest/css/**/*.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});
}
