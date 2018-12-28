module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib-legacy/js/',
		guestwebroot 	= 'guestweb/',
		loginJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'jquery.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-route.min.js', 
				jsLibRoot + 'angular-ui-router.min.js',
				jsLibRoot + 'bootstrap.min.js',
				jsLibRoot + 'ui-bootstrap-tpls-0.10.0.js',
				jsLibRoot + 'oclazyload/ocLazyLoad.min.js',
				sharedRoot + 'lib/js/moment.min.js'
			],
			nonMinifiedFiles: [
				guestwebroot + 'scripts/util.js',
				guestwebroot + 'scripts/app.js',
				guestwebroot + 'scripts/app_config.js',
				guestwebroot + 'scripts/app_router.js',
				guestwebroot + 'shared/**/*.js',
				guestwebroot + 'checkoutlater/**/*.js',
				guestwebroot + 'checkoutnow/**/*.js',
				guestwebroot + 'checkin/**/*.js',
				guestwebroot + 'ccAndRoom/**/*.js',
				guestwebroot + 'preCheckin/**/*.js',
				guestwebroot + 'preCheckin/services/**/*.js',
				sharedRoot + 'sntIDCollection/sntIDCollectionApp.js',
                sharedRoot + 'sntIDCollection/services/*.js',
                sharedRoot + 'sntIDCollection/constants/*.js',
                sharedRoot + 'sntIDCollection/controllers/*.js',
                // Eliminate all spec files
                '!**/*.spec.js'
			]	
		};
		return loginJsAssets;
	}
};
