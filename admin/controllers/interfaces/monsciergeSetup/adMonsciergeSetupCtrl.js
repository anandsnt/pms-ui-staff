admin.controller('adMonsciergeSetupCtrl', ['$scope', 'adMonsciergeSetupSrv', 
	function($scope, adMonsciergeSetupSrv) {
		BaseCtrl.call(this, $scope);

		$scope.saveSettings = function() {
			var onSaveSettingsSucces = function() {
					$scope.successMessage = 'Success, Your settings has been saved.';
				},
				params = dclone($scope.data),
				options = {
					successCallBack: onSaveSettingsSucces
				};

				$scope.deletePropertyIfRequired(params, 'ios_client_secret');
				$scope.deletePropertyIfRequired(params, 'android_client_secret');

				options.params = { 'monscierge': params};

			$scope.callAPI(adMonsciergeSetupSrv.saveSettings, options);
		};

		$scope.fetchSettings = function() {
			var onFetchSettingsSucces = function(data) {
					$scope.data = data.monscierge;
					$scope.hotel_code = data.hotel_code;
					$scope.setDefaultDisplayPassword($scope.data, 'ios_client_secret', 'ios_client_secret_present');
					$scope.setDefaultDisplayPassword($scope.data, 'android_client_secret', 'android_client_secret_present');
				},
				options = {
					successCallBack: onFetchSettingsSucces
				};

			$scope.callAPI(adMonsciergeSetupSrv.getSettings, options);
		};

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.fetchSettings();
		}());

	}
]);
