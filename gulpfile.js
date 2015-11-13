// Generated on 2015-11-12 using generator-angular 0.14.0
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

 var DEST_ROOT_PATH             = '../../public/assets/',
        STAFF_ASSET_LIST_ROOT   = './javascripts/staff/',
        ADMIN_ASSET_LIST_ROOT   = './javascripts/admin/',
        LOGIN_ASSET_LIST_ROOT   = './javascripts/login/',
        ROVER_DASHBOARD_FILE    = '../views/staff/dashboard/rover.html.haml',
        LOGIN_DASHBOARD_FILE    = '../views/login/new.html.haml',
        ADMIN_DASHBOARD_FILE    = '../views/admin/settings/settings.html.haml';