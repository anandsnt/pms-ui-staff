module.exports = function(gulp, $, options) {

	var URL_APPENDER            = options['URL_APPENDER'],
		DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		ROVER_JS_ASSET_LIST     = require ("../../asset_list/js/dashboardJsAssetList").getList(),
		ROVER_JS_MANIFEST_FILE  = "rover_js_manifest.json",
		ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
	    ROVER_HTML_FILE     	= ROVER_TEMPLATE_ROOT + 'rover.html',
	    ROVER_JS_COMBINED_FILE 	= "rover.js",
	    generated 				= "____generated",
	    MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ROVER_JS_MAPPING_FILE 	= '../../asset_list/stateJsMapping/rover/roverStateJsMappings';
	
	//JS - Start
	gulp.task('compile-rover-js-production', function(){
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

	gulp.task('rover-generate-mapping-list-dev', ['copy-all-dev'], function(){
		var glob = require('glob-all'),
			stateMappingList = require(ROVER_JS_MAPPING_FILE).getStateMappingList(),
			fileList = [],
			extendedMappings = {},
			fs = require('fs'),
			mkdirp = require('mkdirp'),
			roverGenDir = DEST_ROOT_PATH + 'asset_list/' 
				+ generated + 'StateJsMappings/' 
				+ generated + 'rover/',
			roverGenFile = roverGenDir + generated + 'roverStateJsMappings.json';
		
		for (state in stateMappingList){
			fileList = require(stateMappingList[state]).getList();
			extendedMappings[state] = glob.sync(fileList).map(function(e){
				return "/assets/" + e;
			});
		}
		mkdirp(roverGenDir, function (err) {
		    if (err) console.error('rover mapping directory failed!! (' + err + ')');
		    else console.log('rover mapping directory created (' + roverGenDir + ')');
	    	fs.writeFile(roverGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('rover mapping file failed!! (' + err + ')');
			    }
			    console.log('rover mapping file created (' + roverGenFile + ')');
			}); 
		});
	});

	gulp.task('rover-generate-mapping-list-prod', function(){
		var glob = require('glob-all'),
			stateMappingList = require(ROVER_JS_MAPPING_FILE).getStateMappingList(),
			fileList = [],
			extendedMappings = {},
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			edit = require('gulp-json-editor'),
			roverGenDir = DEST_ROOT_PATH + 'asset_list/' 
				+ generated + 'StateJsMappings/' 
				+ generated + 'rover/',
			roverGenFile = roverGenDir + generated + 'roverStateJsMappings.json';
		
		for (state in stateMappingList){
			fileList = require(stateMappingList[state]).getList();
			extendedMappings[state] = glob.sync(fileList.nonMinifiedFiles);
		}

		var createMappingFile = function(){
			mkdirp(roverGenDir, function (err) {
			    if (err) console.error('rover mapping directory failed!! (' + err + ')');
		    	fs.writeFile(roverGenFile, JSON.stringify(extendedMappings), function(err) {
				    if(err) {
				        return console.error('rover mapping file failed!! (' + err + ')');
				    }
				    console.log('rover mapping file created (' + roverGenFile + ')');
				}); 
			});
		};

		var tasks = Object.keys(extendedMappings).map(function(key, index){
			console.log ('rover-mapping-generation-started: ' + extendedMappings[key]);
			return gulp.src(extendedMappings[key])
	        .pipe($.concat(key.replace(/\./g, "-")+".min.js"))
	        .pipe($.ngAnnotate({single_quotes: true}))
	        .pipe($.uglify({compress:true, output: {
	        	space_colon: false
	        }}))
	        .pipe($.rev())
	        .pipe(gulp.dest(DEST_ROOT_PATH))
	        .pipe($.rev.manifest())
	        .pipe(edit(function(manifest){
	        	Object.keys(manifest).forEach(function (path, orig) {
			    	extendedMappings[key] = [URL_APPENDER + "/" + manifest[path]];
			    });
			    console.log ('rover-mapping-generation-end: ' + key);
	        	return {};
	        }));
		});

		return es.merge(tasks).on('end', createMappingFile);
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
	
	gulp.task('rover-watch-js-files', function(){
		var paths = ROVER_JS_ASSET_LIST,
			glob = require('glob-all'),
			otherPaths = require(ROVER_JS_MAPPING_FILE).getStateMappingList();
		for (state in otherPaths){
			fileList = require(otherPaths[state]).getList();
			paths = paths.concat(glob.sync(fileList));
		}
		gulp.watch(paths, ['build-rover-js-dev'])
	});

}