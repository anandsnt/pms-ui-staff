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
				jsLibRoot + 'angular.1.7.7.min.js',
				jsLibRoot + 'angular-route.1.7.7.min.js',
				jsLibRoot + 'angular-ui-router.1.0.15.min.js',
				jsLibRoot + 'angular-animate.1.7.7.min.js',
				jsLibRoot + 'angular-dragdrop.min.js',
				jsLibRoot + 'angular-sanitize.1.7.7.min.js',
				jsLibRoot + 'angular-translate.2.18.1.min.js',
				jsLibRoot + 'angular-translate-loader-static-files.2.18.1.min.js',
				jsLibRoot + 'ui-utils.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'ngDialog.min.js',
				jsLibRoot + 'fastclick.min.js',
				jsLibRoot + 'spectrum.js',
				jsLibRoot + 'SyntaxHighlighter/shCore.js',
				jsLibRoot + 'SyntaxHighlighter/shBrushXml.js',
				jsLibRoot + 'SyntaxHighlighter/shBrushJScript.js',
				jsLibRoot + 'treeview/ivh-treeview.min.js',
				jsLibRoot + 'moment.min.js',
				jsLibRoot + 'gapi.min.js',
                // Eliminate all spec files
                '!**/*.spec.js'
			],
			nonMinifiedFiles: [
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
                sharedRoot + 'directives/convertToNumber/*.js',
				sharedRoot + 'directives/tooltip/qtip2.js',
				sharedRoot + 'directives/touchPress/touchPress.js',
				sharedRoot + 'directives/activityIndicator/sntActivityIndicator.js',
                sharedRoot + 'sntTransitionManager/**/*.js',
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
				sharedRoot + 'directives/limitInputRange/limitInputRange.js',
				sharedRoot + 'integrations/*.js',
				adminRoot + 'constants/**/*.js',
                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};		
		
		return adminJsAssets;
	}
};
