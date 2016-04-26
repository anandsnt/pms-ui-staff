module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		loginRoot 		= 'login/',
                //remove ref when virtual keyboard files have updated loading
		loginJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-ui-router.min.js'
			],
			nonMinifiedFiles: [
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
				loginRoot + "**/*.js",
				'!'+loginRoot+'loginJsAssetList.js'
			]	
		};
		return loginJsAssets;
	}
};