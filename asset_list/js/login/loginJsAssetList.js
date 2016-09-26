module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		loginRoot 		= 'login/',
                //remove ref when virtual keyboard files have updated loading
		loginJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-ui-router.min.js',
				jsLibRoot + 'angular-sanitize.min.js'
			],
			nonMinifiedFiles: [
				sharedRoot + 'directives/documentTouchMovePrevent/*.js',
				sharedRoot + 'baseCtrl.js',
				jsLibRoot + 'iscroll.js',
				jsLibRoot + 'ng-iscroll.js',
				jsLibRoot + 'Utils.js',
				loginRoot + 'loginApp.js',
				loginRoot + 'loginRouter.js',
				loginRoot + '**/*.js',
				'!'+loginRoot+'loginJsAssetList.js'
			]	
		};
		return loginJsAssets;
	}
};