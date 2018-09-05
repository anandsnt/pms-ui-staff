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
	      // /**/
	      // if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
	      //     $scope.myScroll[name].scrollTo(0, 0, 100);
	      // }
	    };

	    $timeout(function() {
	    	refreshScroll('financialSettingsList')
	    }, 1000);	
}]);

