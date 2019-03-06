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
				scrollbars: true
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
		$scope.saveLegalSettings = function(screen) {
			$scope.legalSettingsCopy = angular.copy($scope.legalSettings);
			var unwantedKeys = [];

			if (screen === 'financial') {
				unwantedKeys = ['is_print_ar_invoice_number_enabled', 'ar_invoice_number_prefix', 'next_ar_invoice_number', 'ar_invoice_label'];
				if (!$scope.legalSettings.is_print_invoice_enabled) {
					if (!$scope.legalSettings.is_print_folio_enabled) {
						$scope.legalSettings.is_print_folio_enabled = !$scope.legalSettings.is_print_folio_enabled;
						$scope.errorMessage  = ["Both print folio on invoice and print invoice number can't be turned off at same time"];
						return;
					}
				}
			} else if (screen === 'ar') {
				unwantedKeys = ['is_bill_lock_enabled', 'is_print_folio_enabled', 'no_modify_invoice', 'no_reprint_reemail_invoice', 'folio_no_prefix', 'first_folio_number']
			}

			$scope.legalSettings = dclone($scope.legalSettings, unwantedKeys);
			$scope.legalSettings.no_of_original_invoices = parseInt($scope.legalSettings.no_of_original_invoices);
			$scope.legalSettings.no_of_original_emails = parseInt($scope.legalSettings.no_of_original_emails);
			var	options = {
				params: {
					'hotel_id': $scope.data.id,
					'data': $scope.legalSettings
				},
				successCallBack: function(data) {
					if (data.warnings.length === 0) {
						$scope.successMessage = "Saved Succesfully!";
					}
					$scope.legalSettings = $scope.legalSettingsCopy;
					$scope.errorMessage = data.warnings;
				}
			};

			$scope.callAPI(ADHotelDetailsSrv.updateFinancialLegalSettings, options);
		};
		$scope.clearErrorMessage = function() {
			$scope.successMessage = "";
			$scope.errorMessage = "";
		};
		$scope.modifyVoidButton = function() {
			$scope.legalSettings.is_void_bill_enabled = ($scope.legalSettings.is_void_bill_enabled && $scope.legalSettings.is_bill_lock_enabled);
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

