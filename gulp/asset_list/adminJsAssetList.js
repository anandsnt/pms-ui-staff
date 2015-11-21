module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		adminRoot 		= 'admin/',
		adminJsAssets 	= [
			jsLibRoot + 'jquery.js',
			jsLibRoot + 'jquery-ui.min.js',
			jsLibRoot + 'jquery.ui.touch-punch.js',
			jsLibRoot + 'angular.min.js',
			jsLibRoot + 'angular-route.js', 
			jsLibRoot + 'angular-ui-router.js', 
			jsLibRoot + 'angular-animate.js', 
			jsLibRoot + 'angular-dragdrop.min.js',

			jsLibRoot + 'angular-sanitize.js',
			jsLibRoot + 'angular-translate.js',
			jsLibRoot + 'angular-translate-loader-static-files.min.js', 
			jsLibRoot + 'ui-utils.min.js', 
			jsLibRoot + 'bindonce.js',

			jsLibRoot + 'underscore.min.js',
			jsLibRoot + 'fastclick.js',
			jsLibRoot + 'angular-multi-select.js',

			jsLibRoot + 'iscroll.js', 
			jsLibRoot + 'ng-iscroll.js', 
			jsLibRoot + 'ngDialog.min.js', 
			jsLibRoot + 'Utils.js',
			jsLibRoot + 'ng-table.js', 
			jsLibRoot + 'highcharts.js', 
			jsLibRoot + 'angular-highcharts.js',

			sharedRoot + 'interceptors/**/*.js',
			sharedRoot + 'directives/documentTouchMovePrevent/*.js',
			sharedRoot + 'baseCtrl.js',
			sharedRoot + 'iBeaconOperations.js',

			jsLibRoot + 'date.js',

			adminRoot + 'adRouter/**/*.js',
			adminRoot + 'adApp.js',

			adminRoot + 'adRouter.js', adminRoot + 'adUtils.js',
			adminRoot + '../rover/rvSntApp.js',

			adminRoot + 'controllers/**/*.js',
			adminRoot + 'directives/**/*.js',
			adminRoot + 'services/**/*.js'];		
		
		return adminJsAssets;
	}
};