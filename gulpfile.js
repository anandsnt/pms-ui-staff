/**
 * @author Shahul Hameed
 */
'use strict';

var gulp 	  = require('gulp'),
	$         = require('gulp-load-plugins')(),
    tmplCache = require('gulp-angular-templatecache'),
    options   = {
        DEST_ROOT_PATH  : '../../public/assets/',
        URL_APPENDER    :   '/assets',
        TEMPLATE_CACHE  : tmplCache
    };

require('./gulp/gulp_default')(gulp, $, options);  
require('./gulp/login_app_gulp')(gulp, $, options);
