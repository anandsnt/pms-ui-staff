module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		zestRoot 		= 'zest_station/',
                
		adminJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'jquery.min.js',
				jsLibRoot + 'jquery-ui.min.js',
				jsLibRoot + 'jquery.ui.touch-punch.min.js',
                                jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-route.min.js', 
				jsLibRoot + 'angular-ui-router.min.js', 
				jsLibRoot + 'angular-animate.min.js',
				jsLibRoot + 'angular-sanitize.min.js',
				jsLibRoot + 'angular-translate.min.js',
				jsLibRoot + 'angular-translate-loader-static-files.min.js', 
				jsLibRoot + 'ui-utils.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'ngDialog.min.js',
				jsLibRoot + 'fastclick.min.js',
				jsLibRoot + 'signature/**/*.js',
                                jsLibRoot + 'fullcalender/**/*.js',
                                //jquery virtual keyboard files
				//jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-all.min.js',
				//jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-altkeyspopup.min.js',
				//jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-caret.min.js',
				//jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-extender.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-mobile.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-navigation.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-previewkeyset.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-scramble.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-typing.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.min.js',
				jsLibRoot + 'stationKeyboard/jquery.mousewheel.min.js',
				jsLibRoot + 'stationKeyboard/jquery.keyboard.extension-autocomplete.min.js'
                                
			],
			nonMinifiedFiles: [
				jsLibRoot + 'bindonce.js',
				jsLibRoot + 'iscroll.js', 
				jsLibRoot + 'ng-iscroll.js', 
				jsLibRoot + 'Utils.js',
				sharedRoot + 'interceptors/**/*.js',
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
				sharedRoot + 'directives/divTouchMoveStopPropogate/*.js',
				sharedRoot + 'directives/orientationInputBlur/*.js',
				sharedRoot + 'directives/iScrollFixes/iscrollStopPropagation.js',
				sharedRoot + 'directives/touchPress/touchPress.js',
				sharedRoot + 'directives/enterPress/enterPress.js',
				sharedRoot + 'directives/clickTouch/clickTouch.js',
				jsLibRoot + 'date.js',
				'rover/rvSntApp.js',
				zestRoot + 'zsApp.js',
				zestRoot + 'zsUtils.js',
				zestRoot + 'rvMLIOperations.js',
				zestRoot + 'zsWebSocketActions.js',
				zestRoot + 'zsChromeAppActions.js',
				zestRoot + 'zsVirtualKeyboard.js',
				//zestRoot + 'controllers/**/*.js',
				zestRoot + 'controllers_v2/**/*.js',
				zestRoot + 'directives/**/*.js',
				zestRoot + 'services_v2/**/*.js',
				// zestRoot + 'services/**/*.js',
				zestRoot + 'filters/*.js',
				//zestRoot + 'routers/**/*.js',
				zestRoot + 'routers_v2/**/*.js',
				zestRoot + 'constants/**/*.js',
                                //jquery virtual keyboard files
                                
                                zestRoot + 'zsCardOperations.js',
                                zestRoot + 'zsSwipeOperations.js',
                                zestRoot + 'zsMLIOperations.js',
			]
		};		
		
		return adminJsAssets;
	}
};