// Generated on 2015-11-12 using generator-angular 0.14.0
'use strict';

var gulp 	= require('gulp'),
	uglify 	= require('gulp-uglify'),
	rename 	= require('gulp-rename'),
	concat 	= require('gulp-concat'),
    inject  = require('gulp-inject'),
	$ 		= require('gulp-load-plugins'),
	del 	= require('del'),
    less    = require('gulp-less'),
    path    = require('path'),
    templateCache = require('gulp-angular-templatecache');

 var DEST_ROOT_PATH         = '../../public/assets/',
    URL_APPENDER            = "/assets",
    ROVER_ASSET_LIST_ROOT   = './rover/',
    ROVER_JS_ASSET_LIST     = require (ROVER_ASSET_LIST_ROOT + "roverJsAssetList").getList(),
    LOGIN_ASSET_LIST_ROOT   = './login/',
    LOGIN_JS_ASSET_LIST     = require (LOGIN_ASSET_LIST_ROOT + "loginJsAssetList").getList(),
    LOGIN_CSS_ASSET_LIST    = require (LOGIN_ASSET_LIST_ROOT + "loginCSSAssetList").getList(),
    LOGIN_TEMPLATES_FILE    = 'login_templates.js',
    ADMIN_ASSET_LIST_ROOT   = './javascripts/admin/',
    ROVER_DASHBOARD_FILE    = '../views/staff/dashboard/rover.html.haml',
    LOGIN_FILE              = '../views/login/new.html',
    ADMIN_DASHBOARD_FILE    = '../views/admin/settings/settings.html.haml';

gulp.task('clean', function () {
    del([
        DEST_ROOT_PATH
    ], {force: true });
});

gulp.task('copy-all-dev', ['clean'], function() {
    return gulp.src(['**/*.*', '!node_modules/**/*.*', '!package.json'])
        .pipe(gulp.dest(DEST_ROOT_PATH));
});
 
gulp.task('build-login-less', function () {
  return gulp.src(LOGIN_CSS_ASSET_LIST)
    .pipe(less({
      verbose: true,
      filename: 'login.less', // Specify a filename, for better error messages
      compress: true,
      async: true,
      env: "development"
    },
    function (e, output) {
       console.log(output.css);
    }))
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

gulp.task('build-login-template-cache', ['login-template-cache'], function(){
    return gulp.src(LOGIN_FILE)
    .pipe(inject(gulp.src([DEST_ROOT_PATH + LOGIN_TEMPLATES_FILE], {read:false}), {
        starttag: '<!-- inject:templates:{{ext}} -->',
        transform: function(filepath, file, i, length) {
            arguments[0] = URL_APPENDER + "/" + file.relative;
            return inject.transform.apply(inject.transform, arguments);
        }
    }))
    .pipe(gulp.dest('../views/login/', { overwrite: true }));
});

gulp.task('login-template-cache', function () {
  return gulp.src(['partials/**/*.html'], {cwd:'rover/'})
    .pipe(templateCache(LOGIN_TEMPLATES_FILE, {
        module: 'login',
        root: URL_APPENDER + "/partials/"
    }))
    .pipe(gulp.dest(DEST_ROOT_PATH));
});

gulp.task('build-dev', ['build-login-js-dev']);
