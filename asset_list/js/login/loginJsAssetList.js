module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		loginRoot 		= 'login/',
		zestRoot 		= 'zest_station/',
		loginJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-ui-router.min.js',
				jsLibRoot + 'jquery.min.js',
                                jsLibRoot + 'stationKeyboard/*.js'
			],
			nonMinifiedFiles: [
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
				loginRoot + "**/*.js",
				'!'+loginRoot+'loginJsAssetList.js',
                                //these files used for zest station chromeapp 
                                //(need to prompt for virtual keyboard if launched from within a chrome-app)
				zestRoot + 'zsVirtualKeyboard.js',
				zestRoot + 'zsChromeAppActions.js'
			]	
		};
		return loginJsAssets;
	}
};