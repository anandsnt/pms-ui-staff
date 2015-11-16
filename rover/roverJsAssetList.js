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

			jsLibRoot + 'angular-sanitize.js',
			jsLibRoot + 'angular-translate.js',
			jsLibRoot + 'angular-translate-loader-static-files.min.js', 
			jsLibRoot + 'ui-utils.min.js', 
			jsLibRoot + 'bindonce.js',

			jsLibRoot + 'signature/**/*.js', 
			jsLibRoot + 'iscroll.js', 
			jsLibRoot + 'ng-iscroll.js', 
			jsLibRoot + 'ngDialog.min.js',
			jsLibRoot + 'highcharts.js', 
			jsLibRoot + 'angular-highcharts.js', 
			jsLibRoot + 'Utils.js',
			jsLibRoot + 'ng-table.js', 
			jsLibRoot + 'highcharts.js', 
			jsLibRoot + 'angular-highcharts.js',

			sharedRoot + 'interceptors/**/*.js',
			sharedRoot + 'directives/**/*.js',
			sharedRoot + 'lib/**/*.js',
			sharedRoot + 'baseCtrl.js',

			jsLibRoot + 'date.js',

			roverRoot + 'rvRouters/**/*.js',
			roverRoot + 'rvApp.js',
			roverRoot + 'directives/ngReact/**/*.js',
 
			diaryViewRoot + 'util.js',
			diaryViewRoot + 'diary-toggle.js',
			diaryViewRoot + 'diary-grid-row-inactive-rooms.js',
			diaryViewRoot + 'diary-toggle-panel.js',
			diaryViewRoot + 'diary-grid-row-item-drag.js',
			diaryViewRoot + 'diary-grid-row-item.js',
			diaryViewRoot + 'diary-grid-row.js',
			diaryViewRoot + 'diary-room.js',
			diaryViewRoot + 'diary-rooms.js',
			diaryViewRoot + 'diary-room-panel.js',
			diaryViewRoot + 'diary-grid.js',
			diaryViewRoot + 'diary-timeline-resize-grip.js',
			diaryViewRoot + 'diary-timeline-resize.js',
			diaryViewRoot + 'diary-timeline-occupancy.js',
			diaryViewRoot + 'diary-timeline.js',
			diaryViewRoot + 'diary-timeline-panel.js',
			diaryViewRoot + 'diary-grid-panel.js',
			diaryViewRoot + 'diary-content.js',
			reactViewRoot + 'reports/dailyProductionReport/daily-production-content.js',

			roverRoot + 'rvRouter.js', roverRoot + 'rvCardOperations.js', roverRoot + 'rvMLIOperations.js',
			roverRoot + 'rvSwipeOperations.js', roverRoot + 'rvCacheVaultModule.js', 
			roverRoot + 'rvDesktopCardOperations.js', roverRoot + 'rvSntApp.js',

			roverRoot + 'controllers/**/*.js', roverRoot + 'services/**/*.js', 
			roverRoot + 'directives/**/*.js', roverRoot + 'filters/**/*.js',
			roverRoot + 'factories/**/*.js', roverRoot + 'constants/**/*.js'];		
		
		return roverJsAssets;
	}
};