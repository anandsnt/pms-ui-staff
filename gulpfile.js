/**
 * @author Shahul Hameed
 */
'use strict';

var gulp 	  = require('gulp'),
	$         = require('gulp-load-plugins')({
		rename: {
			'gulp-ng-annotate': 'ngAnnotate',
			'gulp-angular-templatecache': 'templateCache'
		}
	}),
    options   = {
        DEST_ROOT_PATH  : '../../public/assets/',
        URL_APPENDER    : '/assets'
    };

require('./gulp/gulp_default')(gulp, $, options);  
require('./gulp/login_app_gulp')(gulp, $, options);
