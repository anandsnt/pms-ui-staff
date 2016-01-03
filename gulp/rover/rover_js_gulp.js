module.exports = function(gulp, $, options) {

	var URL_APPENDER            = options['URL_APPENDER'],
		DEST_ROOT_PATH      	= options['DEST_ROOT_PATH'],
		ROVER_JS_MANIFEST_FILE  = "rover_js_manifest.json",
		ROVER_TEMPLATE_ROOT     = '../views/staff/dashboard/',
	    ROVER_HTML_FILE     	= ROVER_TEMPLATE_ROOT + 'rover.html',
	    extendedMappings 		= {},
	    generated 				= "____generated",
	    ROVER_JS_MAPPING_FILE 	= '../../asset_list/stateJsMapping/rover/roverStateJsMappings',
	    stateMappingList 		= require(ROVER_JS_MAPPING_FILE).getStateMappingList(),
	    MANIFEST_DIR 			=  __dirname + "/manifests/",
	    onError  				= options.onError,
	    roverGenDir 			= DEST_ROOT_PATH + 'asset_list/' + generated + 'StateJsMappings/' + generated + 'rover/',
		roverGenFile 			= roverGenDir + generated + 'roverStateJsMappings.json';

	//Be careful: PRODUCTION
	gulp.task('create-statemapping-and-inject-rover-js-production', function(){
	    var file_name = extendedMappings['rover.dashboard'][0],
	    	mkdirp = require('mkdirp'),
			fs = require('fs');
		
		mkdirp(roverGenDir, function (err) {
		    if (err) console.error('rover mapping directory failed!! (' + err + ')');
	    	fs.writeFile(roverGenFile, JSON.stringify(extendedMappings), function(err) {
			    if(err) {
			        return console.error('rover mapping file failed!! (' + err + ')');
			    }
			    console.log('rover mapping file created (' + roverGenFile + ')');
			}); 
		});

	    return gulp.src(ROVER_HTML_FILE)
	        .pipe($.inject(gulp.src('../../public' + file_name, {read:false}), {
	            transform: function(filepath, file, i, length) {
	            	console.log('Rover injecting dashboard js file (' + (file_name) + ") to "  + ROVER_HTML_FILE);
	                arguments[0] = URL_APPENDER + "/" + file.relative;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }))
	});

	gulp.task('rover-build-js-and-mapping-list-prod', function(){
		var glob = require('glob-all'),
			fileList = [],
			es = require('event-stream'),
			stream 	= require('merge-stream'),
			edit = require('gulp-json-editor');

		var tasks = Object.keys(stateMappingList).map(function(state, index){
			console.log ('rover-mapping-generation-started: ' + state);
			var mappingList  		= require(stateMappingList[state]).getList(),
				nonMinifiedFiles 	= mappingList.nonMinifiedFiles,
				minifiedFiles 		= mappingList.minifiedFiles,
				fileName 			= state.replace(/\./g, "-")+".min.js";

			var nonMinifiedStream = gulp.src(nonMinifiedFiles)
					.pipe($.jsvalidate())
					.on('error', onError)
			        .pipe($.concat(fileName))
			        .on('error', onError)
			        .pipe($.ngAnnotate({single_quotes: true, debug: true}))
			        .on('error', onError)
			        .pipe($.uglify({compress:true, output: {
			        	space_colon: false
			        }}))
			        .on('error', onError),

			    minifiedStream = gulp.src(minifiedFiles)
			    	.pipe($.jsvalidate())
					.on('error', onError)
			    	.pipe($.uglify({compress:false, mangle:false, preserveComments: false}));
			
			return stream(minifiedStream, nonMinifiedStream)
				.on('error', onError)
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
		return es.merge(tasks);
	});


	gulp.task('rover-generate-mapping-list-dev', ['rover-copy-js-files'], function(){
		var glob 		= require('glob-all'),
			fileList 	= [],
			fs 			= require('fs'),
			mkdirp 		= require('mkdirp'),
			combinedList = [];
		
		for (state in stateMappingList){
			combinedList 	= require(stateMappingList[state]).getList();
			fileList 		= combinedList.minifiedFiles.concat(combinedList.nonMinifiedFiles);
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

	gulp.task('build-rover-js-dev', ['rover-generate-mapping-list-dev'], function(){
		//since extendedMappings contains /assets/ and that is not a valid before gulp.src
		var dashboardFiles = extendedMappings['rover.dashboard']
			.map(function(e){  
				e = e.replace("/assets/", "");
				return e;
			});

	    return gulp.src(ROVER_HTML_FILE)
	        .pipe($.inject(gulp.src(dashboardFiles, {read:false}), {
	            transform: function(filepath, file, i, length) {
	                arguments[0] = URL_APPENDER + filepath;
	                return $.inject.transform.apply($.inject.transform, arguments);
	            }
	        }))
	        .pipe(gulp.dest(ROVER_TEMPLATE_ROOT, { overwrite: true }));
	});

	//JS - END
	
	gulp.task('rover-watch-js-files', function(){
		var paths = [],
			glob = require('glob-all'),
			combinedList = [];
		for (state in stateMappingList){
			combinedList 	= require(stateMappingList[state]).getList();
			fileList 		= combinedList.minifiedFiles.concat(combinedList.nonMinifiedFiles);
			paths 			= paths.concat(glob.sync(fileList));
		}
		gulp.watch(paths, ['build-rover-js-dev'])
	});
	
	gulp.task('rover-copy-js-files', function(){
		var fileList = [];
		for (state in stateMappingList){
			combinedList 	= require(stateMappingList[state]).getList();
			fileList = fileList.concat(combinedList.minifiedFiles.concat(combinedList.nonMinifiedFiles));
		}
		return gulp.src(fileList, {base: '.'})
			.pipe(gulp.dest(DEST_ROOT_PATH, { overwrite: true }));
	});


}