module.exports = {
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		roverRoot 		= 'rover/',
		controllerRoot 	= roverRoot + 'controllers/',
		serviceRoot 	= roverRoot + 'services/',
		directiveRoot	= roverRoot + 'directives/',
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
				roverRoot + 'rvRouter.js', roverRoot + 'rvCardOperations.js', roverRoot + 'rvMLIOperations.js', roverRoot + 'rvUUIDService.js', roverRoot + 'rvDesktopUUIDService.js',
				roverRoot + 'rvSwipeOperations.js', roverRoot + 'rvCacheVaultModule.js',
				roverRoot + 'rvDesktopCardOperations.js', roverRoot + 'rvSntApp.js',

				roverRoot + 'filters/roundFilter.js',
				roverRoot + 'filters/highlightWordsFilter.js',

				controllerRoot + 'rvTopCtrl.js',
				controllerRoot + 'rvRoverController.js',
				controllerRoot + 'dashboard/**/*.js',
				controllerRoot + 'availability/rvAvailabilityButtonCtrl.js',
				controllerRoot + 'search/**/*.js',
				controllerRoot + 'errorPopup/rvTimeoutErrorCtrl.js',
				controllerRoot + 'workstation/rvWorkstationCtrl.js',

				serviceRoot + 'baseWebSrvV2.js',
				serviceRoot + 'rvBaseWebSrv.js',
				serviceRoot + 'rvBaseWebSrvV2.js',
				serviceRoot + 'rvDashboardSrv.js',
				serviceRoot + 'menu/rvMenuSrv.js',
				serviceRoot + 'rvHKOWSTestSrv.js',
				serviceRoot + 'jsMappings/jsMappingsSrv.js',
				serviceRoot + 'permissions/rvPermissionSrv.js',
				serviceRoot + 'rvSearchSrv.js',
				serviceRoot + 'rvHotelDetailsSrv.js',
				serviceRoot + 'housekeeping/rvHkRoomStatusSrv.js',
				serviceRoot + 'util/rvUtilSrv.js',
				serviceRoot + 'availability/rvAvailabilitySrv.js',
				serviceRoot + 'workstation/workstationSrv.js',
				serviceRoot + 'housekeeping/rvHkRoomStatusSrv.js',
				directiveRoot + 'Outside Click handler/outsideClickDirective.js',
				directiveRoot + 'pagination/*.js'
			]
		};

		return roverJsAssets;
	}
};