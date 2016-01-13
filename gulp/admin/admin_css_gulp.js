module.exports = function(gulp, $, options) {

	var DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		URL_APPENDER            = options['URL_APPENDER'],
		MANIFEST_DIR 			= __dirname + "/manifests/",
		ADMIN_TEMPLATE_ROOT     = options['ADMIN_TEMPLATE_ROOT'],
	    ADMIN_HTML_FILE     	= options['ADMIN_HTML_FILE'],
	    ADMIN_CSS_MANIFEST_FILE = "admin_css_manifest.json",
	    ADMIN_CSS_FILE  		= 'admin.css',
	    LESS_SOURCE_FILE 		= 'stylesheets/admin.css',
	    runSequence 			= require('run-sequence'),
	    LessPluginCleanCSS 		= require('less-plugin-clean-css'),
		cleancss 				= new LessPluginCleanCSS({ advanced: true }),
		onError  				= options.onError;

	//LESS - START
	var cssInjector = function(fileName) {
		return gulp.src(ADMIN_HTML_FILE)
			.pipe($.inject(gulp.src([DEST_ROOT_PATH + fileName], {read:false}), {
	            starttag: '<!-- inject:less:{{ext}} -->',
	            transform: function(filepath, file, i, length) {
	            	console.log('Admin injecting css file (' + (fileName) + ") to "  + ADMIN_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
       		}))
       		.pipe(gulp.dest(ADMIN_TEMPLATE_ROOT, { overwrite: true }));
	};

	gulp.task('inject-admin-less-production-to-template', function(){
		var template_manifest_json = require(MANIFEST_DIR + ADMIN_CSS_MANIFEST_FILE),
	        file_name = template_manifest_json[ADMIN_CSS_FILE];
	    return cssInjector(file_name);
	});

	gulp.task('admin-less-production',  function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
	        	compress: true
	        }))
	        .on('error', onError)
	        .pipe($.minifyCSS({keepSpecialComments : 0, advanced: true}).on('error', onError))
	        .pipe($.rev())
	        .on('error', onError)
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest(ADMIN_CSS_MANIFEST_FILE))
	        .pipe(gulp.dest(MANIFEST_DIR));
	});

	gulp.task('admin-less-dev', ['admin-copy-less-files'], function () {
	  return gulp.src(LESS_SOURCE_FILE)
	        .pipe($.less({
				plugins: [cleancss]
			}))
			.on('error', onError)
	        .pipe(gulp.dest(DEST_ROOT_PATH));
	});

	gulp.task('build-admin-less-dev', ['admin-less-dev'], function(){
	    return cssInjector(ADMIN_CSS_FILE);
	});

	//inorder to tackle the bug in injector, doing this way
	//bug noticed: parallel injecting is not possible. When 400+ js injection is going on css injection is failing
	gulp.task('build-admin-less-js-dev', ['admin-less-dev', 'build-admin-js-dev'], function(){
	    return cssInjector(ADMIN_CSS_FILE);
	});

	gulp.task('admin-watch-less-files', function(){
		var paths = [LESS_SOURCE_FILE].concat(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'admin/css/**/*.*']);
		return gulp.watch(paths, function(callback){
			return runSequence('build-admin-less-dev', 'copy-admin-base-html');
		});			
	});

	gulp.task('admin-copy-less-files', function(){
		return gulp.src(['stylesheets/**/*.*', 'images/**/*.*', 'cssimg/**/**.*', 'type/**/**.*', 'admin/css/**/*.*'], {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});
}