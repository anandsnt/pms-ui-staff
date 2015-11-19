/**
 * @author Shahul Hameed
 */
'use strict';

var gulp 	  = require('gulp'),
	$         = require('gulp-load-plugins')(),
    options   = {
        DEST_ROOT_PATH  : '../../public/assets/',
        URL_APPENDER    : '/assets',
        TEMPLATE_CACHE  : require('gulp-angular-templatecache')
    };

require('./gulp/gulp_default')(gulp, $, options);  
require('./gulp/login_app_gulp')(gulp, $, options);
