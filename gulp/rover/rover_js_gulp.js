module.exports = function(gulp, $, options) {

	var URL_APPENDER            = options['URL_APPENDER'],
		DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		ROVER_JS_ASSET_LIST     = require ("../../asset_list/js/dashboardJsAssetList").getList(),
		ROVER_JS_MANIFEST_FILE  = "rover_js_manifest.json",
		ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
	    ROVER_HTML_FILE     	= ROVER_TEMPLATE_ROOT + 'rover.html',
	    extendedMappings 		= {},
	    generated 				= "____generated",
	    MANIFEST_DIR 			=  __dirname + "/manifests/",
	    ROVER_JS_MAPPING_FILE 	= '../../asset_list/stateJsMapping/rover/roverStateJsMappings';

	//Be careful: PRODUCTION
	gulp.task('build-rover-js-production', ['rover-generate-mapping-list-prod'], function(){
	    var file_name = extendedMappings['rover.dashboard'][0];
	    return gulp.src(ROVER_HTML_FILE)
	        .pipe($.inject(gulp.src('../../public' + file_name, {read:false}), {
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

	gulp.task('rover-generate-mapping-list-prod', ['copy-all-prod'], function(){
		var glob = require('glob-all'),
			stateMappingList = require(ROVER_JS_MAPPING_FILE).getStateMappingList(),
			fileList = [],
			fs = require('fs'),
			es = require('event-stream'),
			mkdirp = require('mkdirp'),
			edit = require('gulp-json-editor'),
			roverGenDir = DEST_ROOT_PATH + 'asset_list/' 
				+ generated + 'StateJsMappings/' 
				+ generated + 'rover/',
			roverGenFile = roverGenDir + generated + 'roverStateJsMappings.json';

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

		var tasks = Object.keys(stateMappingList).map(function(state, index){
			console.log ('rover-mapping-generation-started: ' + state);
			var mappingList  		= require(stateMappingList[state]).getList(),
				nonMinifiedFiles 	= mappingList.nonMinifiedFiles,
				minifiedFiles 		= mappingList.minifiedFiles,
				fileName 			= state.replace(/\./g, "-")+".min.js",
				stream 				= require('merge-stream');

			var nonMinifiedStream = gulp.src(nonMinifiedFiles)
			        .pipe($.concat(fileName))
			        .pipe($.ngAnnotate({single_quotes: true}))
			        .pipe($.uglify({compress:true, output: {
			        	space_colon: false
			        }})),

			    minifiedStream = gulp.src(minifiedFiles)
			    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));
			
			return stream(minifiedStream, nonMinifiedStream)
		        .pipe($.concat(fileName))
		        .pipe($.rev())
		        .pipe(gulp.dest(DEST_ROOT_PATH), { overwrite: true })
		        .pipe($.rev.manifest())
		        .pipe(edit(function(manifest){
		        	Object.keys(manifest).forEach(function (path, orig) {
				    	extendedMappings[state] = [URL_APPENDER + "/" + manifest[path]];
				    });
				    console.log ('rover-mapping-generation-end: ' + state);
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