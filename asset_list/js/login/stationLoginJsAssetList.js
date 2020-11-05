module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		loginRoot 		= 'login/',
                // remove ref when virtual keyboard files have updated loading
		loginJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-ui-router.min.js',
                // for virtual keyboard, these should be moved to load with station login page
				jsLibRoot + 'jquery.min.js',
                jsLibRoot + 'stationKeyboard/*.js',
				jsLibRoot + 'angular-sanitize.min.js',
				jsLibRoot + 'ngDialog.min.js'
			],
			nonMinifiedFiles: [
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
                sharedRoot + 'directives/clickTouch/clickTouch.js',
                sharedRoot + 'interceptors/**/*.js',

                loginRoot + 'loginApp.js',
                loginRoot + 'loginRouter.js',
				loginRoot + "**/*.js",

				jsLibRoot + 'iscroll.js',
				jsLibRoot + 'ng-iscroll.js',
				'!'+loginRoot+'stationLoginJsAssetList.js',
                // these files used for zest station chromeapp 
                // (need to prompt for virtual keyboard if launched from within a chrome-app)
				sharedRoot + 'stationKeyboard/virtualKeyBoard.js',
                // Eliminate all spec files
                '!**/*.spec.js',
                '!**/*.conf.js'

			]	
		};
		return loginJsAssets;
	}
};
