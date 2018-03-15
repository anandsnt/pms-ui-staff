admin.controller('ADAccountReceivablesCtrl', ['$scope', '$state', 'ADHotelSettingsSrv', function($scope, $state, ADHotelSettingsSrv) {
	
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	
	// Fetch details on account receivables screen.
	var fetchAccountReceivableStatus = function() {
		// Succss callback
		var successCallbackFetch = function(data) {
			$scope.data = data;
		},
		// Failure callback
		failureCallbackFetch = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		},
		// option object
		options = {
			params: {},
			successCallBack: successCallbackFetch,
			failureCallBack: failureCallbackFetch
		};

		$scope.callAPI(ADHotelSettingsSrv.fetch, options);
	};

	// Handle save button action
	$scope.saveAccountReceivableStatus = function() {

			var settings = $scope.data.ar_number_settings,
				postData = {
				'ar_number_settings': {
					'is_auto_assign_ar_numbers': settings.is_auto_assign_ar_numbers
				}
			};

			if (!!settings.selected_manual_charge_code_id) {
				postData.ar_number_settings.selected_manual_charge_code_id = settings.selected_manual_charge_code_id;
			}

			// option object
			var options = {
				params: postData
			};

			$scope.callAPI(ADHotelSettingsSrv.update, options);
	};
	
	fetchAccountReceivableStatus();
}]);

