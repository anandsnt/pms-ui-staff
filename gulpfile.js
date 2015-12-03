/**
 * @author Shahul Hameed
 */
'use strict';

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
				    	console.log ('--------GULP TASK FAILED---\n\n')
				    	console.log(error);
				    	console.log('\n\n---END OF GULP ERROR MESSAGE--')
				    	require('exit')(0);
				    }
    			};

require('./gulp/gulp_default')(gulp, $, options);  
require('./gulp/login_app_gulp')(gulp, $, options);
require('./gulp/rover_app_gulp')(gulp, $, options);
require('./gulp/admin_app_gulp')(gulp, $, options);
