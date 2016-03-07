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
                jsLibRoot + 'fullcalender/**/*.js'
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
				sharedRoot + 'baseCtrl.js',
				jsLibRoot + 'date.js',
				'rover/rvSntApp.js',
				zestRoot + 'zsApp.js',
				zestRoot + 'rvMLIOperations.js',
				zestRoot + 'controllers/**/*.js',
				zestRoot + 'directives/**/*.js',
				zestRoot + 'services/**/*.js',
				zestRoot + 'routers/**/*.js',
				zestRoot + 'constants/**/*.js'
			]
		};		
		
		return adminJsAssets;
	}
};