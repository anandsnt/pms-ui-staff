/**
 * @author Shahul Hameed
 */
'use strict';

var gulp 	  = require('gulp'),
	$         = require('gulp-load-plugins')({
		rename: {
			'gulp-ng-annotate': 'ngAnnotate',
			'gulp-angular-templatecache': 'templateCache',
			'gulp-minify-html': 'minifyHTML',
			'gulp-minify-css': 'minifyCSS',
			'gulp-concat-util': 'translationConcat'
		}
	}),
    options   = {
        DEST_ROOT_PATH  : '../../public/assets/',
        URL_APPENDER    : '/assets'
    };

require('./gulp/gulp_default')(gulp, $, options);  
require('./gulp/login_app_gulp')(gulp, $, options);
require('./gulp/rover_app_gulp')(gulp, $, options);
require('./gulp/admin_app_gulp')(gulp, $, options);
