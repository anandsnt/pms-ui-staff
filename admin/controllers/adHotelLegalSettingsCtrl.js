admin.controller('adHotelLegalSettingsController', 
	['$rootScope',
	 '$scope',
	 'ADHotelDetailsSrv',
	 'ngDialog',
	 '$timeout', 
	 function($rootScope, $scope, ADHotelDetailsSrv, ngDialog, $timeout) {
	 	$scope.activeTab = 'financials';
	 	var scrollerOptions = {
	        tap: true,
	        preventDefault: false,
	        showScrollbar: true
	      };

	    $scope.setScroller('financialSettingsList', scrollerOptions);
	 	/*
	 	 * clicked each tab
	 	 */
	 	$scope.clickedTabMenu = function(tabName) {
	 		$scope.activeTab = tabName;
	 	};
	 	/*
	 	 * close dialog
	 	 */
	 	$scope.closeDialog = function() {
	 		ngDialog.close();
	 	};
	 	var refreshScroll = function(name, reset) {
	      $scope.refreshScroller(name);
	    };

	    $timeout(function() {
	    	refreshScroll('financialSettingsList')
	    }, 400);	
}]);

