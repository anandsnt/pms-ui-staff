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
				jsLibRoot + 'angular-route.min.js', 
				jsLibRoot + 'angular-ui-router.min.js',
				jsLibRoot + 'bootstrap.min.js',
				jsLibRoot + 'ui-bootstrap-tpls-0.10.0.js',
				jsLibRoot + 'oclazyload/ocLazyLoad.min.js'
				// guestwebroot + 'scripts/angular-pickdate.js'
			],
			nonMinifiedFiles: [
				guestwebroot + 'scripts/util.js',
				guestwebroot + 'scripts/app.js',
				guestwebroot + 'scripts/app_config.js',
				guestwebroot + 'scripts/app_router.js',
				guestwebroot + 'scripts/angular-pickdate.js',
				guestwebroot + 'services/*.js',
				guestwebroot + 'controllers/**/*.js'
			]	
		};
		return guestwebJSassets;
	}
};