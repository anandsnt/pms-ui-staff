module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		guestwebroot 	= 'guestweb_v2/',
		guestwebJSassets 	= {
			minifiedFiles: [
				jsLibRoot + 'jquery.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-ui-router.min.js',
				jsLibRoot + 'bootstrap.min.js',
				jsLibRoot + 'ui-bootstrap-tpls-0.10.0.js',
				jsLibRoot + 'angular-sanitize.min.js'
			],
			nonMinifiedFiles: [
				guestwebroot + 'utility/gwUtil.js',
				guestwebroot + 'utility/gwThemingUtility.js',
				guestwebroot + 'gwApp.js',
				guestwebroot + 'gwAppConfig.js',
				guestwebroot + 'routers/gwMainAppRouter.js',
				guestwebroot + 'routers/gwAppRouter.js',
				guestwebroot + 'routers/gwCheckinRouter.js',
				guestwebroot + 'routers/gwCheckoutRouter.js',
				guestwebroot + 'scripts/angular-pickdate.js',
				guestwebroot + 'services/*.js',
				guestwebroot + 'controllers/**/*.js',
				guestwebroot + 'directives/**/*.js',
                // Eliminate all spec files
                '!**/*.spec.js'
			]	
		};
		return guestwebJSassets;
	}
};
