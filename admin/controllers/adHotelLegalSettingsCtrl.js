admin.controller('adHotelLegalSettingsController', 
	['$rootScope',
	'$scope',
	'ADHotelDetailsSrv',
	'ngDialog',
	'$timeout', 
	function($rootScope, $scope, ADHotelDetailsSrv, ngDialog, $timeout) {
		BaseCtrl.call(this, $scope);
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
		var refreshScroll = function(name) {
			$scope.refreshScroller(name);
		};

		/*
		 * update legal settings
		 */
		$scope.saveLegalSettings = function() {
			var options = {
				params: {
					'hotel_id': $scope.data.id,
					'data': $scope.legalSettings
				},
				successCallBack: function(data) {
					if (data.errors.length === 0) {
						$scope.successMessage = "Saved Succesfully!";
					}
					
					$scope.errorMessage = data.errors;
				}
			};

			$scope.callAPI(ADHotelDetailsSrv.updateFinancialLegalSettings, options);
		};
		$scope.clearErrorMessage = function() {
			$scope.successMessage = "";
			$scope.errorMessage = "";
		};
		/*
		 * Initial loading
		 */
		$scope.init = function() {
			$timeout(function() {
				refreshScroll('financialSettingsList');
			}, 400);

			var options = {
				params: {
					'hotel_id': $scope.data.id
				},
				successCallBack: function(response) {
					$scope.legalSettings = response.data;
				}
			};

			$scope.callAPI(ADHotelDetailsSrv.getFinancialLegalSettings, options);
		};
		$scope.init();
}]);

