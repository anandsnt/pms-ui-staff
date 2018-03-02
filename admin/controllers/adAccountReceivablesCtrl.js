admin.controller('ADAccountReceivablesCtrl', ['$scope', '$state', 'ADHotelSettingsSrv', function($scope, $state, ADHotelSettingsSrv) {

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

	$scope.fetchAccountReceivableStatus = function() {

		var successCallbackFetch = function(data) {
			$scope.data = data;
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADHotelSettingsSrv.fetch, "", successCallbackFetch);

	};

	$scope.saveAccountReceivableStatus = function() {

			var settings = $scope.data.ar_number_settings;

			var postData = {
				'ar_number_settings': {
					'is_auto_assign_ar_numbers': settings.is_auto_assign_ar_numbers
				}
			};

			if (!!settings.selected_manual_charge_code_id) {
				postData.ar_number_settings.selected_manual_charge_code_id = settings.selected_manual_charge_code_id;
			}

			if (!!settings.selected_credit_charge_code_id) {
				postData.ar_number_settings.selected_credit_charge_code_id = settings.selected_credit_charge_code_id;
			}
			
			var postSuccess = function() {
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(ADHotelSettingsSrv.update, postData, postSuccess);
	};
	$scope.fetchAccountReceivableStatus();


}]);

