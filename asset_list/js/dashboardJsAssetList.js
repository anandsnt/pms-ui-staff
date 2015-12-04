module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		roverRoot 		= 'rover/',
		roverJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + 'jquery.min.js',
				jsLibRoot + 'jquery-ui.min.js',
				jsLibRoot + 'jquery.ui.touch-punch.min.js',
				jsLibRoot + 'angular.min.js',
				jsLibRoot + 'angular-route.min.js', 
				jsLibRoot + 'angular-ui-router.min.js', 
				jsLibRoot + 'angular-animate.min.js', 
				jsLibRoot + 'angular-dragdrop.min.js',
				jsLibRoot + 'oclazyload/ocLazyLoad.min.js',
				jsLibRoot + 'angular-sanitize.min.js',
				jsLibRoot + 'angular-translate.min.js',
				jsLibRoot + 'angular-translate-loader-static-files.min.js', 
				jsLibRoot + 'ui-utils.min.js',
				jsLibRoot + 'underscore.min.js',
				jsLibRoot + 'ngDialog.min.js',
				jsLibRoot + 'fastclick.min.js'				
			],
			nonMinifiedFiles: [
				jsLibRoot + 'bindonce.js',
				jsLibRoot + 'iscroll.js',
				jsLibRoot + 'ng-iscroll.js',
				jsLibRoot + 'Utils.js',
				jsLibRoot + 'date.js',

				sharedRoot + 'interceptors/**/*.js',
				sharedRoot + 'directives/**/*.js',
				sharedRoot + 'baseCtrl.js',

				roverRoot + 'rvRouters/**/*.js',
				roverRoot + 'rvApp.js',
				roverRoot + 'rvRouter.js', roverRoot + 'rvCardOperations.js', roverRoot + 'rvMLIOperations.js',
				roverRoot + 'rvSwipeOperations.js', roverRoot + 'rvCacheVaultModule.js', 
				roverRoot + 'rvDesktopCardOperations.js', roverRoot + 'rvSntApp.js',

				roverRoot + 'controllers/rvTopCtrl.js',
				roverRoot + 'controllers/rvRoverController.js',
				roverRoot + 'controllers/dashboard/**/*.js',
				roverRoot + 'controllers/availability/rvAvailabilityButtonCtrl.js',
				roverRoot + 'controllers/search/**/*.js',

				roverRoot + 'services/baseWebSrvV2.js',
				roverRoot + 'services/rvBaseWebSrv.js',
				roverRoot + 'services/rvBaseWebSrvV2.js',
				roverRoot + 'services/rvDashboardSrv.js',
				roverRoot + 'services/menu/rvMenuSrv.js',
				roverRoot + 'services/jsMappings/jsMappingsSrv.js',
				roverRoot + 'services/permissions/rvPermissionSrv.js',
				roverRoot + 'services/rvSearchSrv.js',
				roverRoot + 'services/rvHotelDetailsSrv.js',
				roverRoot + 'services/util/rvUtilSrv.js',
				roverRoot + 'services/availability/rvAvailabilitySrv.js',
				roverRoot + 'filters/roundFilter.js'
			]
		};		
		
		return roverJsAssets;
	}
};