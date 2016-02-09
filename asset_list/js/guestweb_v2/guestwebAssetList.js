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
				guestwebroot + 'scripts/gw_util.js',
				guestwebroot + 'scripts/gw_theming_utility.js',
				guestwebroot + 'scripts/gw_app.js',
				guestwebroot + 'scripts/gw_app_config.js',
				guestwebroot + 'scripts/gw_main_app_router.js',
				guestwebroot + 'scripts/gw_app_router.js',
				guestwebroot + 'scripts/angular-pickdate.js',
				guestwebroot + 'services/*.js',
				guestwebroot + 'controllers/**/*.js'
			]	
		};
		return guestwebJSassets;
	}
};