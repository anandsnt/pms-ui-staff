/**
 * @author Shahul Hameed
 */
var gulp 	  = require('gulp'),
	rename    = {
					'gulp-ng-annotate': 'ngAnnotate', 'gulp-angular-templatecache': 'templateCache', 
					'gulp-minify-html': 'minifyHTML', 'gulp-minify-css': 'minifyCSS',
					'gulp-concat-util': 'translationConcat'
				},
	$         = require('gulp-load-plugins')({rename: rename }),
    options   = {
			        DEST_ROOT_PATH  : '../../public/assets/',
			        URL_APPENDER    : '/assets',
				    onError: function (error) {
				    	console.log ('--------GULP TASK FAILED---\n\n');
				    	
				    	console.trace(error);
				    	console.log('\n\n---END OF GULP ERROR MESSAGE--');
				    	require('exit')(1);
				    },
				    silentErrorShowing: function(error){
				    	// If you want details of the error in the console
					  	console.log ('--------GULP TASK SILENT ERROR---\n\n')
				    	
				    	console.trace(error);
				    	console.log('\n\n---END OF GULP ERROR MESSAGE--')

					  	this.emit('end');
				    }
    			};

require('./gulp/gulp_default')(gulp, $, options);
require('./gulp/gulp_dev_server')(gulp, $, options); 
require('./gulp/login_app_gulp')(gulp, $, options);
require('./gulp/station_login_app_gulp')(gulp, $, options);
require('./gulp/rover_app_gulp')(gulp, $, options);
require('./gulp/admin_app_gulp')(gulp, $, options);
require('./gulp/zest_app_gulp')(gulp, $, options);
require('./gulp/guestweb_app_gulp')(gulp, $, options);
require('./gulp/guestweb_v2_app_gulp')(gulp, $, options);
require('./gulp/image_optimization_gulp')(gulp, $, options);
require('./gulp/payment_app_gulp')(gulp, $, options);
