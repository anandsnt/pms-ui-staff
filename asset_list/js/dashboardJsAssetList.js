module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		roverRoot 		= 'rover/',
		reactViewRoot 	= roverRoot + 'react/',
		diaryViewRoot 	= reactViewRoot + 'diary/',
		roverJsAssets 	= [
			jsLibRoot + 'jquery.js',
			jsLibRoot + 'jquery-ui.min.js',
			jsLibRoot + 'jquery.ui.touch-punch.js',
			jsLibRoot + 'angular.min.js',
			jsLibRoot + 'angular-route.js', 
			jsLibRoot + 'angular-ui-router.js', 
			jsLibRoot + 'angular-animate.js', 
			jsLibRoot + 'angular-dragdrop.min.js',
			jsLibRoot + 'oclazyload/ocLazyLoad.min.js',

			jsLibRoot + 'angular-sanitize.js',
			jsLibRoot + 'angular-translate.js',
			jsLibRoot + 'angular-translate-loader-static-files.min.js', 
			jsLibRoot + 'ui-utils.min.js', 
			jsLibRoot + 'bindonce.js',
			jsLibRoot + 'underscore.min.js',

			jsLibRoot + 'iscroll.js', 
			jsLibRoot + 'ng-iscroll.js', 
			jsLibRoot + 'ngDialog.min.js',

			jsLibRoot + 'Utils.js',

			sharedRoot + 'interceptors/**/*.js',
			sharedRoot + 'directives/**/*.js',
			
			sharedRoot + 'baseCtrl.js',

			jsLibRoot + 'date.js',

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
			roverRoot + 'services/permissions/rvPermissionSrv.js',
			roverRoot + 'services/rvSearchSrv.js',
			roverRoot + 'services/rvHotelDetailsSrv.js',
			roverRoot + 'services/util/rvUtilSrv.js',
			roverRoot + 'services/availability/rvAvailabilitySrv.js',
			roverRoot + 'filters/roundFilter.js'];		
		
		return roverJsAssets;
	}
};