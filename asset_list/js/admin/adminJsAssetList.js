module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		adminRoot 		= 'admin/',
		adminJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'jquery.min.js',
				jsLibRoot + 'jquery-ui.min.js',
				jsLibRoot + 'jquery.ui.touch-punch.min.js',
				jsLibRoot + 'jquery.qtip.min.js',
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-route.min.js', 
				jsLibRoot + 'angular-ui-router.min.js', 
				jsLibRoot + 'angular-animate.min.js', 
				jsLibRoot + 'angular-dragdrop.min.js',
				jsLibRoot + 'angular-sanitize.min.js',
				jsLibRoot + 'angular-translate.min.js',
				jsLibRoot + 'angular-translate-loader-static-files.min.js', 
				jsLibRoot + 'ui-utils.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'ngDialog.min.js',
				jsLibRoot + 'fastclick.min.js',
				jsLibRoot + 'spectrum.js'		
			],
			nonMinifiedFiles: [
				jsLibRoot + 'bindonce.js',
				jsLibRoot + 'sortable.js',				
				jsLibRoot + 'angular-multi-select.js',
				jsLibRoot + 'iscroll.js', 
				jsLibRoot + 'ng-iscroll.js', 
				jsLibRoot + 'Utils.js',
				jsLibRoot + 'ng-table.js',
				sharedRoot + 'interceptors/**/*.js',
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
				sharedRoot + 'directives/divTouchMoveStopPropogate/*.js',
				sharedRoot + 'directives/orientationInputBlur/*.js',
				sharedRoot + 'directives/fauxMultiSelect/*.js',
				sharedRoot + 'directives/eventReachedRoot/*.js',
				sharedRoot + 'directives/ngClassWithoutAnimation/*.js',
				sharedRoot + 'directives/tooltip/qtip2.js',
				sharedRoot + 'baseCtrl.js',
				sharedRoot + 'iBeaconOperations.js',
				jsLibRoot + 'date.js',
				adminRoot + 'adRouter/**/*.js',
				adminRoot + 'adApp.js',
				adminRoot + 'adRouter.js', adminRoot + 'adUtils.js',
				adminRoot + '../rover/rvSntApp.js',
				adminRoot + 'controllers/**/*.js',
				adminRoot + 'directives/**/*.js',
				adminRoot + 'services/**/*.js',
				adminRoot + 'filters/*.js',
				sharedRoot + 'directives/uiColorpicker/uiColorpicker.js',
				sharedRoot + 'directives/onScroll/onScroll.js',
				sharedRoot + 'directives/limitInputRange/limitInputRange.js'
			]
		};		
		
		return adminJsAssets;
	}
};