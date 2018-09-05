admin.controller('adHotelLegalSettingsController', 
	['$rootScope',
	 '$scope',
	 'ADHotelDetailsSrv',
	 'ngDialog',
	 function($rootScope, $scope, ADHotelDetailsSrv, ngDialog) {
	 	$scope.activeTab = 'financials';
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
	
}]);

