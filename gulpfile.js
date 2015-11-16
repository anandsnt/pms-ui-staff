// Generated on 2015-11-12 using generator-angular 0.14.0
'use strict';

var gulp 	= require('gulp'),
	uglify 	= require('gulp-uglify'),
	rename 	= require('gulp-rename'),
	concat 	= require('gulp-concat'),
    inject  = require('gulp-inject'),
	$ 		= require('gulp-load-plugins'),
	del 	= require('del');

 var DEST_ROOT_PATH             = '../../public/assets/',
        URL_APPENDER            = "/assets",
        ROVER_ASSET_LIST_ROOT   = './rover/',
        ROVER_JS_ASSET_LIST     = require (ROVER_ASSET_LIST_ROOT + "roverJsAssetList").getList(),
        LOGIN_ASSET_LIST_ROOT   = './login/',
        LOGIN_JS_ASSET_LIST     = require (LOGIN_ASSET_LIST_ROOT + "loginJsAssetList").getList(),
        ADMIN_ASSET_LIST_ROOT   = './javascripts/admin/',
        ROVER_DASHBOARD_FILE    = '../views/staff/dashboard/rover.html.haml',
        LOGIN_FILE              = '../views/login/new.html',
        ADMIN_DASHBOARD_FILE    = '../views/admin/settings/settings.html.haml';


/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
    del([
        DEST_ROOT_PATH
    ], {force: true });
});


gulp.task('copy-all-dev', ['clean'], function() {
    return gulp.src(['**/*.*', '!node_modules/**/*.*', '!package.json'])
        .pipe(gulp.dest(DEST_ROOT_PATH));
});

gulp.task('build-login-js-dev', ['copy-all-dev'], function(){
    return gulp.src(LOGIN_FILE)
        .pipe(inject(gulp.src(LOGIN_JS_ASSET_LIST, {read:false}), {
            transform: function(filepath, file, i, length) {
                arguments[0] = URL_APPENDER + filepath;
                return inject.transform.apply(inject.transform, arguments);
            }
        }))
        .pipe(gulp.dest('../views/login/', { overwrite: true }));
});


gulp.task('build-dev', ['build-login-js-dev']);
