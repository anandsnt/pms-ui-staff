module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		loginRoot 		= 'login/',
		loginJsAssets 	= [
			jsLibRoot + 'angular.min.js',
			jsLibRoot + 'angular-ui-router.js', 

			sharedRoot + 'directives/documentTouchMovePrevent/*.js',
			loginRoot + "**/*.js",
			'!'+loginRoot+'loginJsAssetList.js'];		
		
		return loginJsAssets;
	}
};